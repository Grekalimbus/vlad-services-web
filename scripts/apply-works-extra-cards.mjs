/**
 * Targeted D1 update: insert 2 empty Projects cards for a 4×2 grid.
 * Preserves existing card order (row1: 0–2, row2: 3–5) and all other fields.
 *
 * Dry-run (default): node scripts/apply-works-extra-cards.mjs
 * Apply:            node scripts/apply-works-extra-cards.mjs --apply
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";
const EMPTY = {
  title: "",
  lines: [],
  href: "",
  src: "",
  alt: "",
  position: "center",
  icon: "",
  photos: [],
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

const select = await queryD1("SELECT body, updated_at FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) {
  console.error("CMS document missing from D1.");
  process.exit(1);
}

const document = JSON.parse(row.body);
const cards = document.copy?.home?.works?.cards;
if (!Array.isArray(cards)) {
  console.error("copy.home.works.cards is missing.");
  process.exit(1);
}

const plan = {
  updatedAt: row.updated_at,
  beforeCount: cards.length,
  beforeTitles: cards.map((card) => card.title),
};

if (cards.length !== 6) {
  console.log(JSON.stringify({ ...plan, action: "skip", reason: `expected 6 cards, found ${cards.length}` }, null, 2));
  process.exit(0);
}

const next = structuredClone(document);
next.copy.home.works.cards.splice(3, 0, structuredClone(EMPTY));
next.copy.home.works.cards.push(structuredClone(EMPTY));

plan.afterCount = next.copy.home.works.cards.length;
plan.afterTitles = next.copy.home.works.cards.map((card) => card.title || "(empty)");
plan.row1 = plan.afterTitles.slice(0, 4);
plan.row2 = plan.afterTitles.slice(4, 8);

mkdirSync("migration", { recursive: true });
writeFileSync("migration/works-extra-cards-plan.json", JSON.stringify(plan, null, 2));
console.log(JSON.stringify({ ...plan, apply: APPLY }, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply after explicit approval to write production D1.");
  process.exit(0);
}

const updatedAt = new Date().toISOString();
const body = JSON.stringify(next);
const update = await queryD1(
  "UPDATE documents SET body = ?, updated_at = ? WHERE id = ? AND json_array_length(json_extract(body, '$.copy.home.works.cards')) = 6",
  [body, updatedAt, "site"],
);

const verify = await queryD1(
  "SELECT updated_at, json_array_length(json_extract(body, '$.copy.home.works.cards')) AS card_count FROM documents WHERE id = ?",
  ["site"],
);
const verified = verify.results?.[0];
console.log(
  JSON.stringify(
    {
      applied: true,
      changes: update.meta?.changes ?? null,
      verifiedCardCount: verified?.card_count ?? null,
      verifiedUpdatedAt: verified?.updated_at ?? null,
    },
    null,
    2,
  ),
);

if (verified?.card_count !== 8) {
  console.error("Verification failed: expected 8 cards after apply.");
  process.exit(1);
}
