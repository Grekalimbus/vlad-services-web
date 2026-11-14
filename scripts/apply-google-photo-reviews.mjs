/**
 * Replace googleReviews with 12 five-star Google reviews that include photos.
 * Photos are downloaded to /tmp/google-review-photos-v2, uploaded to R2, then D1 is updated.
 *
 * Dry-run: node scripts/apply-google-photo-reviews.mjs
 * Apply:   node scripts/apply-google-photo-reviews.mjs --apply
 */
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { spawnSync } from "node:child_process";

const APPLY = process.argv.includes("--apply");
const reviews = JSON.parse(readFileSync("/tmp/google-top12-photo-reviews.json", "utf8"));
const outDir = "/tmp/google-review-photos-v2";
mkdirSync(outDir, { recursive: true });
mkdirSync("migration", { recursive: true });

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "review";
}

function envValue(name) {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) return fromProcess;
  try {
    const text = readFileSync(".env.local", "utf8");
    const match = text.match(new RegExp(`^${name}=(.*)$`, "m"));
    return match?.[1]?.trim() || "";
  } catch {
    return "";
  }
}

async function cloudflareToken() {
  const explicit = envValue("CLOUDFLARE_API_TOKEN");
  if (explicit) return explicit;
  const text = readFileSync(join(homedir(), "Library/Preferences/.wrangler/config/default.toml"), "utf8");
  const token = text.match(/^oauth_token\s*=\s*"(.*)"$/m)?.[1];
  if (!token) throw new Error("Cloudflare credentials were not found.");
  return token;
}

async function queryD1(sql, params = []) {
  const accountId = envValue("CLOUDFLARE_ACCOUNT_ID");
  if (!accountId) throw new Error("Set CLOUDFLARE_ACCOUNT_ID.");
  const databaseId = envValue("CLOUDFLARE_D1_DATABASE_ID") || "a7b9675c-46b4-481e-a7ce-447985f5b63b";
  const token = await cloudflareToken();
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }),
    },
  );
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    const message = payload.errors?.map((e) => e.message).filter(Boolean).join("; ");
    throw new Error(message || `D1 query failed (${response.status})`);
  }
  return payload.result?.[0] ?? { results: [], meta: {} };
}

const manifest = [];
for (const review of reviews) {
  const id = slug(review.author);
  const photos = [];
  const sources = review.photos.slice(0, 3);
  for (let i = 0; i < sources.length; i++) {
    const url = sources[i];
    const file = join(outDir, `${id}-${i + 1}.jpg`);
    if (!existsSync(file)) {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Referer: "https://www.google.com/",
        },
      });
      if (!res.ok) throw new Error(`Download failed ${res.status} for ${review.author} #${i + 1}`);
      writeFileSync(file, Buffer.from(await res.arrayBuffer()));
    }
    const hash = createHash("sha256").update(readFileSync(file)).digest("hex").slice(0, 8);
    const key = `uploads/google-review-${id}-${i + 1}-${hash}.jpg`;
    photos.push({
      file,
      key,
      src: `/api/media/${key}`,
      bytes: readFileSync(file).length,
      type: "image/jpeg",
    });
  }
  manifest.push({
    id,
    author: review.author,
    dateLabel: String(review.dateLabel || "").replace(/^Edited\s+/i, ""),
    rating: review.rating,
    quote: review.quote,
    photos,
  });
}

writeFileSync("migration/google-review-photos-manifest.json", JSON.stringify(manifest, null, 2));
console.log(
  JSON.stringify(
    {
      apply: APPLY,
      reviews: manifest.length,
      photos: manifest.reduce((n, r) => n + r.photos.length, 0),
      authors: manifest.map((r) => r.author),
    },
    null,
    2,
  ),
);

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply to upload R2 and write production D1.");
  process.exit(0);
}

for (const review of manifest) {
  for (const photo of review.photos) {
    console.log("uploading", photo.key);
    const result = spawnSync(
      "npx",
      [
        "wrangler",
        "r2",
        "object",
        "put",
        `primefixpros-media/${photo.key}`,
        "--file",
        photo.file,
        "--content-type",
        "image/jpeg",
        "--remote",
      ],
      { encoding: "utf8", cwd: process.cwd() },
    );
    if (result.status !== 0) {
      console.error(result.stdout, result.stderr);
      throw new Error(`R2 upload failed for ${photo.key}`);
    }
  }
}

const select = await queryD1("SELECT body, updated_at FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) throw new Error("CMS document missing");
const document = JSON.parse(row.body);
const before = Array.isArray(document.googleReviews) ? document.googleReviews : [];
const nextReviews = manifest.map((item) => ({
  id: item.id,
  author: item.author,
  dateLabel: item.dateLabel,
  rating: item.rating,
  quote: item.quote,
  photos: item.photos.map((p) => p.src),
}));

const plan = {
  beforeUpdatedAt: row.updated_at,
  beforeCount: before.length,
  afterCount: nextReviews.length,
  withPhotos: nextReviews.filter((r) => r.photos.length).length,
  authors: nextReviews.map((r) => ({ id: r.id, author: r.author, photos: r.photos.length })),
};
writeFileSync("migration/google-reviews-update-plan.json", JSON.stringify(plan, null, 2));

const next = structuredClone(document);
next.googleReviews = nextReviews;
const updatedAt = new Date().toISOString();
const body = JSON.stringify(next);
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [body, updatedAt, "site"]);
const verify = await queryD1(
  `SELECT updated_at, json_array_length(json_extract(body, '$.googleReviews')) AS n FROM documents WHERE id = ?`,
  ["site"],
);
console.log(JSON.stringify({ plan, verify: verify.results?.[0] }, null, 2));
