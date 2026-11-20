/**
 * Append two empty Projects video cards. Existing videos are left unchanged.
 *
 * Dry-run: node scripts/apply-works-video-slots.mjs
 * Apply:   node scripts/apply-works-video-slots.mjs --apply
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";
const EXTRA_IDS = ["works-video-7", "works-video-8"];

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
const present = new Set(before.map((item) => item?.id));
const missing = EXTRA_IDS.filter((id) => !present.has(id));
console.log(
  JSON.stringify(
    {
      beforeCount: before.length,
      ids: before.map((item) => item?.id || ""),
      adding: missing,
    },
    null,
    2,
  ),
);

if (!APPLY || missing.length === 0) {
  console.log(missing.length === 0 ? "Empty cards are already stored." : "Dry-run only. Re-run with --apply to write production D1.");
  process.exit(0);
}

const next = structuredClone(document);
next.copy.home.works.videos = [
  ...before,
  ...missing.map((id) => ({ id, media: "", poster: "", alt: "" })),
];
const updatedAt = new Date().toISOString();
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [
  JSON.stringify(next),
  updatedAt,
  "site",
]);

const verify = await queryD1(
  "SELECT json_array_length(json_extract(body, '$.copy.home.works.videos')) AS video_count FROM documents WHERE id = ?",
  ["site"],
);
console.log(JSON.stringify({ updatedAt, videoCount: verify.results?.[0]?.video_count ?? null }, null, 2));
