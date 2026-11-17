/**
 * Targeted D1 update: seed the home trust promo copy when a field is missing.
 * Never overwrites a value that is already stored.
 *
 * Dry-run: node scripts/apply-trust-promo.mjs
 * Apply:   node scripts/apply-trust-promo.mjs --apply
 */
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";

const INITIAL = {
  lead: "Black Friday:",
  accent: "30% OFF",
  tail: "Any Order",
  text: "Book online in under a minute and the discount is applied to your total.",
  button: "GET MY 30% OFF",
};

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

const select = await queryD1("SELECT body FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) {
  console.error("CMS document missing from D1.");
  process.exit(1);
}

const document = JSON.parse(row.body);
if (!document.copy?.home || typeof document.copy.home !== "object") {
  console.error("copy.home is missing.");
  process.exit(1);
}

const current = document.copy.home.trustPromo && typeof document.copy.home.trustPromo === "object"
  ? document.copy.home.trustPromo
  : {};
const nextPromo = { ...current };
const seeded = [];
for (const [key, value] of Object.entries(INITIAL)) {
  if (typeof nextPromo[key] === "string") continue;
  nextPromo[key] = value;
  seeded.push(key);
}

console.log(JSON.stringify({ seeded, alreadyStored: Object.keys(INITIAL).filter((key) => !seeded.includes(key)) }, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply to write production D1.");
  process.exit(0);
}

if (seeded.length === 0) {
  console.log("Nothing to update.");
  process.exit(0);
}

const next = structuredClone(document);
next.copy.home.trustPromo = nextPromo;
const updatedAt = new Date().toISOString();
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [
  JSON.stringify(next),
  updatedAt,
  "site",
]);

const verify = await queryD1(
  "SELECT json_extract(body, '$.copy.home.trustPromo') AS promo FROM documents WHERE id = ?",
  ["site"],
);
const stored = JSON.parse(verify.results?.[0]?.promo || "{}");
console.log(JSON.stringify({ updatedAt, keys: Object.keys(stored) }, null, 2));
