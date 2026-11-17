/**
 * Targeted D1 update: seed Electrical deal accordion cards when missing,
 * and clear offersFooter. Never overwrites existing cards.
 *
 * Dry-run: node scripts/apply-deal-offer-cards.mjs
 * Apply:   node scripts/apply-deal-offer-cards.mjs --apply
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const APPLY = process.argv.includes("--apply");
const DATABASE_ID = "a7b9675c-46b4-481e-a7ce-447985f5b63b";

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

const electricalOfferCards = [
  {
    id: "electrical-bundle",
    category: "BUNDLE & SAVE",
    offer: "40% OFF",
    subtitle: "More Projects. Bigger Savings!",
    description:
      "Planning several electrical upgrades? Bundle your eligible projects and enjoy 40% OFF the regular labor price.",
    disclaimerTitle: "BUNDLE YOUR PROJECTS & SAVE 40%!",
    disclaimerText: "Discount applies to eligible bundled labor services. Materials and specialty work are quoted separately.",
    detail: "",
    listTitle: "Eligible projects may include:",
    listItems: [
      "Ceiling fan installations",
      "Chandeliers & light fixtures",
      "Outlet replacements",
      "Switches & dimmers",
      "Smart lighting upgrades",
      "Multiple lighting installations",
    ],
    extra: "",
    icon: "layers",
    buttonLabel: "GET DEAL",
  },
  {
    id: "electrical-lighting",
    category: "HOLIDAY SPECIAL",
    offer: "$89",
    subtitle: "Ceiling Fans, Chandeliers & Light Fixtures",
    description: "Give your home a fresh look with our special Black Friday installation pricing.",
    disclaimerTitle: "ONE INSTALLATION. ONE GREAT PRICE — $89!",
    disclaimerText:
      "Per standard fixture. Existing compatible wiring and electrical box required. New wiring, fan-rated box upgrades, high ceilings, complex assembly, and specialty fixtures cost extra.",
    detail: "",
    listTitle: "Available installations:",
    listItems: [
      "Standard ceiling fans",
      "Standard chandeliers",
      "Pendant lights",
      "Flush-mount ceiling lights",
      "Replacement light fixtures",
    ],
    extra: "",
    icon: "fan",
    buttonLabel: "GET DEAL",
  },
  {
    id: "electrical-outlets",
    category: "QUICK UPGRADES",
    offer: "$69",
    subtitle: "Small Electrical Upgrades. Big Savings!",
    description: "Refresh your home's outlets and switches with our Black Friday special.",
    disclaimerTitle: "UPGRADE YOUR HOME FOR JUST $69!",
    disclaimerText:
      "Per standard replacement using existing wiring. Devices, materials, troubleshooting, and circuit modifications may cost extra.",
    detail: "",
    listTitle: "Available services:",
    listItems: [
      "Standard outlet replacement",
      "Standard light switch replacement",
      "Compatible dimmer replacement",
      "Basic outlet and switch upgrades",
    ],
    extra: "",
    icon: "plug",
    buttonLabel: "GET DEAL",
  },
  {
    id: "electrical-smart",
    category: "SMART HOME DEAL",
    offer: "$99+",
    subtitle: "Make Your Home Smarter This Black Friday!",
    description: "Upgrade your lighting with convenient smart controls and compatible connected devices.",
    disclaimerTitle: "SMARTER LIGHTING. MORE CONVENIENCE. BIG HOLIDAY SAVINGS!",
    disclaimerText:
      "Starting labor price per compatible device. Smart devices sold separately. Additional wiring and compatibility work are not included.",
    detail: "",
    listTitle: "Available upgrades:",
    listItems: [
      "Smart light switches",
      "Smart dimmers",
      "Compatible smart lighting controls",
      "Basic app setup and device pairing",
      "Lighting schedules and automation setup",
    ],
    extra: "",
    icon: "smart",
    buttonLabel: "GET DEAL",
  },
];

mkdirSync("migration", { recursive: true });

const select = await queryD1("SELECT body, updated_at FROM documents WHERE id = ?", ["site"]);
const row = select.results?.[0];
if (!row?.body) {
  console.error("CMS document missing from D1.");
  process.exit(1);
}

const document = JSON.parse(row.body);
const items = document.copy?.dealsPage?.items;
if (!Array.isArray(items)) {
  console.error("copy.dealsPage.items is missing.");
  process.exit(1);
}

const electricalIndex = items.findIndex((item) => item?.id === "electrical");
if (electricalIndex < 0) {
  console.error("Electrical deal item not found.");
  process.exit(1);
}

const electrical = items[electricalIndex];
const existingCards = Array.isArray(electrical.offerCards) ? electrical.offerCards : [];
const hasCards = existingCards.length > 0;
const hasFooter = electrical.offersFooter != null;

const plan = {
  electricalIndex,
  electricalTitle: electrical.title || "",
  hadOfferCards: hasCards,
  existingCardCount: existingCards.length,
  hadFooter: hasFooter,
  willSeedCards: !hasCards,
  willClearFooter: hasFooter,
  seededCardIds: electricalOfferCards.map((card) => card.id),
};

writeFileSync("migration/deal-offer-cards-plan.json", JSON.stringify(plan, null, 2));
console.log(JSON.stringify(plan, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply to write production D1.");
  process.exit(0);
}

if (hasCards && !hasFooter) {
  console.log("Nothing to update — cards present and footer already cleared.");
  process.exit(0);
}

const next = structuredClone(document);
const target = next.copy.dealsPage.items[electricalIndex];
if (!hasCards) target.offerCards = electricalOfferCards;
target.offersFooter = null;

const updatedAt = new Date().toISOString();
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [
  JSON.stringify(next),
  updatedAt,
  "site",
]);

const verify = await queryD1(
  `SELECT json_array_length(json_extract(body, '$.copy.dealsPage.items.${electricalIndex}.offerCards')) AS cards,
          json_type(json_extract(body, '$.copy.dealsPage.items.${electricalIndex}.offersFooter')) AS footerType
   FROM documents WHERE id = ?`,
  ["site"],
);

console.log(JSON.stringify({ updatedAt, verify: verify.results?.[0] }, null, 2));