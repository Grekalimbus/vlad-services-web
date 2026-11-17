/**
 * Targeted D1 update: ensure copy.home.works.videos has 6 slots.
 * Slot 0 uses the uploaded R2 video; slots 1–5 stay empty for admin fills.
 *
 * Dry-run: node scripts/apply-works-videos.mjs
 * Apply:   node scripts/apply-works-videos.mjs --apply
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";
const FIRST_SRC = JSON.parse(readFileSync("migration/works-video-1-upload.json", "utf8")).src;

function emptyVideo(index) {
  return {
    id: `works-video-${index + 1}`,
    media: index === 0 ? FIRST_SRC : "",
    poster: "",
    alt: "",
  };
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
  const databaseId = envValue("CLOUDFLARE_D1_DATABASE_ID") || DATABASE_ID;
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
    const message = payload.errors?.map((error) => error.message).filter(Boolean).join("; ");
    throw new Error(message || `D1 query failed (${response.status})`);
  }
  return payload.result?.[0] ?? { results: [], meta: {} };
}

if (!FIRST_SRC) throw new Error("Missing migration/works-video-1-upload.json src.");

const select = await queryD1("SELECT body, updated_at FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) {
  console.error("CMS document missing from D1.");
  process.exit(1);
}

const document = JSON.parse(row.body);
const works = document.copy?.home?.works;
if (!works || typeof works !== "object") {
  console.error("copy.home.works is missing.");
  process.exit(1);
}

const before = Array.isArray(works.videos) ? works.videos : [];
const next = structuredClone(document);
const videos = Array.from({ length: 6 }, (_, index) => {
  const existing = before[index];
  if (index === 0) {
    return {
      id: existing?.id?.trim() || "works-video-1",
      media: FIRST_SRC,
      poster: existing?.poster?.trim() || "",
      alt: existing?.alt?.trim() || "",
    };
  }
  if (existing && typeof existing === "object") {
    return {
      id: existing.id?.trim() || `works-video-${index + 1}`,
      media: existing.media?.trim() || "",
      poster: existing.poster?.trim() || "",
      alt: existing.alt?.trim() || "",
    };
  }
  return emptyVideo(index);
});
next.copy.home.works.videos = videos;

const plan = {
  updatedAt: row.updated_at,
  firstSrc: FIRST_SRC,
  beforeCount: before.length,
  beforeMedia: before.map((item) => item?.media || ""),
  afterCount: videos.length,
  afterMedia: videos.map((item) => item.media || "(empty)"),
  apply: APPLY,
};

mkdirSync("migration", { recursive: true });
writeFileSync("migration/works-videos-plan.json", JSON.stringify(plan, null, 2));
console.log(JSON.stringify(plan, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply after explicit approval to write production D1.");
  process.exit(0);
}

const updatedAt = new Date().toISOString();
const body = JSON.stringify(next);
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [body, updatedAt, "site"]);

const verify = await queryD1(
  "SELECT updated_at, json_extract(body, '$.copy.home.works.videos[0].media') AS first_media, json_array_length(json_extract(body, '$.copy.home.works.videos')) AS video_count FROM documents WHERE id = ?",
  ["site"],
);
console.log(JSON.stringify({ verified: verify.results?.[0] ?? null }, null, 2));
