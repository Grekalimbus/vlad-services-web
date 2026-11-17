/**
 * Targeted D1 update: seed offer cards (+ intro text) for TV, Handyman,
 * Landscaping, and Seasonal deals when offerCards is missing/empty.
 * Never overwrites existing cards or unrelated fields.
 *
 * Dry-run: node scripts/apply-remaining-deal-offer-cards.mjs
 * Apply:   node scripts/apply-remaining-deal-offer-cards.mjs --apply
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

function card(partial) {
  return {
    detail: "",
    extra: "",
    buttonLabel: "GET DEAL",
    ...partial,
  };
}

const seeds = [
  {
    match: (item) => item?.id === "tv-mounting",
    text: [
      "BIG SAVINGS. PROFESSIONAL INSTALLATION. ANY TV SIZE!",
      "",
      "This Black Friday, PrimeFix is bringing you our biggest TV mounting deals! Whether you need a simple installation or a complete entertainment setup, we've got an offer for you.",
      "",
      "Choose from four exclusive deals designed to fit your needs and your budget.",
    ].join("\n"),
    offerCards: [
      card({
        id: "tv-complete-setup",
        category: "COMPLETE SETUP",
        offer: "40% OFF",
        subtitle: "Build Your Own TV Mounting Package!",
        description:
          "Get 40% OFF your customized TV installation package when you bundle the services you need.",
        disclaimerTitle: "YOUR SETUP. YOUR CHOICE. 40% OFF!",
        disclaimerText:
          "Discount applies to eligible bundled services. Materials, specialty equipment, and additional charges may vary.",
        listTitle: "Available services include:",
        listItems: [
          "TV mounting — any size",
          "Fixed, tilting, full-motion, or specialty mounts",
          "Cable concealment & wire management",
          "Soundbar installation",
          "Streaming devices & gaming console mounting",
          "Recessed TV outlets and compatible electrical upgrades",
          "Drywall, plaster, concrete, brick & stone mounting",
          "Above-fireplace TV installation",
        ],
        icon: "layers",
      }),
      card({
        id: "tv-basic-mounting",
        category: "BASIC TV MOUNTING",
        offer: "$89",
        subtitle: "Any TV Size | Standard Installation",
        description: "Keep it simple and save big this Black Friday!",
        disclaimerTitle: "ONE TV. ONE WALL. ONLY $89!",
        disclaimerText: "TV mount and additional services are not included.",
        listTitle: "What's included:",
        listItems: [
          "Professional TV wall mounting",
          "Any TV size, subject to safe mounting conditions",
          "Installation using your existing compatible wall mount",
          "Secure positioning, leveling & safety check",
        ],
        icon: "tv",
      }),
      card({
        id: "tv-wire-hiding",
        category: "WIRE HIDING",
        offer: "$129",
        subtitle: "Any TV Size | Cable Management Included",
        description:
          "Enjoy a professionally mounted television with a cleaner, more organized appearance.",
        disclaimerTitle: "SAVE MORE. HIDE THE WIRES. ENJOY THE VIEW!",
        disclaimerText:
          "Standard external cable concealment included. In-wall concealment, electrical work, wall mount, and specialty installations are additional.",
        listTitle: "What's included:",
        listItems: [
          "Professional TV wall mounting",
          "Any TV size, subject to safe mounting conditions",
          "FREE standard external cable concealment",
          "Leveling & secure installation",
          "Final safety check",
        ],
        icon: "tv",
      }),
      card({
        id: "tv-free-mount",
        category: "FREE TV MOUNT",
        offer: "$129",
        subtitle: "Any TV Size | Standard Mount Included",
        description: "Don't have a TV mount? We've got you covered!",
        disclaimerTitle: "YOUR TV. OUR MOUNT. ONE GREAT PRICE!",
        disclaimerText:
          "Includes one compatible standard mount. Full-motion, ceiling, pull-down, and specialty mounts are available at additional cost.",
        listTitle: "What's included:",
        listItems: [
          "Professional TV wall mounting",
          "Any TV size, subject to safe mounting conditions",
          "FREE compatible standard fixed or tilting TV mount",
          "Secure installation & leveling",
          "Final safety check",
        ],
        icon: "tv",
      }),
    ],
  },
  {
    match: (item) => item?.id === "handyman",
    text: [
      "SMALL REPAIRS. BIG SAVINGS. ONE TRUSTED TEAM!",
      "",
      "This Black Friday, PrimeFix makes home repairs and improvements more affordable than ever! From drywall repairs and furniture assembly to door adjustments, picture hanging, shelving, and smart home installations — we've got your to-do list covered.",
      "",
      "Choose one of our two exclusive holiday deals!",
    ].join("\n"),
    offerCards: [
      card({
        id: "handyman-hourly",
        category: "HOURLY SPECIAL",
        offer: "$55/hr",
        subtitle: "Professional Handyman Services — Only $55 Per Hour!",
        description:
          "Get your home improvement projects done for less with our special Black Friday hourly rate. Regular rate $70/hr.",
        disclaimerTitle: "SAVE $15 FOR EVERY HOUR OF WORK!",
        disclaimerText: "Hourly labor rate only. Materials and additional expenses are not included.",
        listTitle: "Perfect for:",
        listItems: [
          "Furniture assembly",
          "Minor home repairs",
          "Door & window adjustments",
          "Shelf installation",
          "Picture & mirror hanging",
          "General handyman tasks",
        ],
        icon: "wrench",
      }),
      card({
        id: "handyman-project",
        category: "PROJECT DISCOUNT",
        offer: "35% OFF",
        subtitle: "Your Home Projects. Your Choice. Bigger Savings!",
        description:
          "Have a specific project in mind? Enjoy 35% OFF eligible handyman tasks when you book during our Black Friday promotion.",
        disclaimerTitle: "GET 35% OFF YOUR NEXT HANDYMAN PROJECT!",
        disclaimerText:
          "Discount applies to eligible labor services at regular rates. Materials and specialty work are quoted separately.",
        listTitle: "Eligible services may include:",
        listItems: [
          "Drywall repair & patching",
          "Furniture assembly",
          "Smart camera & device installation",
          "Door & window repairs",
          "Picture, mirror & artwork hanging",
          "Shelving & minor home improvements",
          "Other qualifying handyman services",
        ],
        icon: "layers",
      }),
    ],
  },
  {
    match: (item) => item?.id === "landscaping",
    text: [
      "BEAUTIFUL OUTDOOR SPACES. BIG HOLIDAY SAVINGS!",
      "",
      "This Black Friday, PrimeFix is bringing exclusive savings to your outdoor projects! Whether you're refreshing your backyard, upgrading your patio, planting a beautiful garden, or planning a larger landscape transformation, we have a deal for you.",
      "",
      "Explore our four limited-time Black Friday offers and bring your outdoor vision to life for less!",
    ].join("\n"),
    offerCards: [
      card({
        id: "landscape-custom-package",
        category: "CUSTOM PACKAGE",
        offer: "35% OFF",
        subtitle: "Your Outdoor Project. Your Choice. Big Savings!",
        description:
          "Create your own landscaping package and save 35% OFF eligible labor services when you combine multiple outdoor improvements.",
        disclaimerTitle: "BUILD YOUR PACKAGE & SAVE 35%!",
        disclaimerText:
          "Discount applies to eligible bundled labor services. Major construction projects and materials are excluded.",
        listTitle: "Services may include:",
        listItems: [
          "Yard cleanup and refresh",
          "Planting flowers, shrubs, and greenery",
          "Garden bed improvements",
          "Mulch and decorative ground cover",
          "Minor landscaping improvements",
          "Outdoor organization and finishing touches",
        ],
        icon: "layers",
      }),
      card({
        id: "landscape-yard-refresh",
        category: "YARD REFRESH",
        offer: "30% OFF",
        subtitle: "Refresh Your Yard. Transform Your Curb Appeal!",
        description:
          "Give your outdoor space a fresh new look with our exclusive Black Friday yard improvement special.",
        disclaimerTitle: "A FRESHER YARD FOR 30% LESS!",
        disclaimerText:
          "Discount applies to eligible labor services. Plants, materials, and debris disposal may cost extra.",
        listTitle: "Eligible services include:",
        listItems: [
          "Backyard and front yard cleanup",
          "Weed and unwanted plant removal",
          "Planting flowers, shrubs, and small plants",
          "Garden bed design and refresh",
          "Mulch and decorative ground cover installation",
          "Hedge trimming and general yard improvements",
        ],
        icon: "leaf",
      }),
      card({
        id: "landscape-patio",
        category: "PATIO & OUTDOOR",
        offer: "35% OFF",
        subtitle: "Upgrade Your Outdoor Living Space & Save!",
        description:
          "Turn your backyard or patio into a comfortable, beautiful place to relax and entertain.",
        disclaimerTitle: "MORE COMFORT. MORE STYLE. 35% OFF!",
        disclaimerText:
          "Discount applies to eligible installation labor. Materials, electrical work, and construction are quoted separately.",
        listTitle: "Eligible services include:",
        listItems: [
          "Decorative outdoor lighting",
          "Patio string lights",
          "Freestanding fountains and water features",
          "Outdoor furniture assembly",
          "Shade canopies and freestanding tents",
          "Decorative landscaping features",
          "Small patio improvements",
        ],
        icon: "leaf",
      }),
      card({
        id: "landscape-transformations",
        category: "TRANSFORMATIONS",
        offer: "20% OFF",
        subtitle: "Bigger Projects. Beautiful Results. Exclusive Savings!",
        description:
          "Planning a more substantial outdoor improvement? Take advantage of our Black Friday offer on qualifying landscape transformation projects.",
        disclaimerTitle: "TRANSFORM YOUR OUTDOOR SPACE & SAVE 20%!",
        disclaimerText:
          "Discount applies to eligible labor only. Materials, design, permits, and specialty work are additional. Projects are subject to contractor licensing requirements.",
        listTitle: "Projects may include:",
        listItems: [
          "Custom outdoor woodwork",
          "Raised garden beds and planter boxes",
          "Tree and large shrub planting",
          "Decorative stone and gravel features",
          "Walkways and landscape borders",
          "Patio tile and paver improvements",
          "Major landscape refresh projects",
        ],
        icon: "leaf",
      }),
    ],
  },
  {
    match: (item) =>
      item?.id === "seasonal" ||
      /seasonal|outdoor decoration|holiday decor/i.test(`${item?.id || ""} ${item?.title || ""}`),
    text: [
      "MAKE YOUR HOME SHINE THIS HOLIDAY SEASON! 🎄",
      "",
      "This Black Friday, PrimeFix brings you exclusive savings on professional Christmas light installation, outdoor holiday decorations, Christmas tree setup, and festive backyard transformations!",
      "",
      "From beautiful rooftop lights to glowing reindeer and fully decorated outdoor spaces, let us handle the setup while you enjoy the holiday magic.",
    ].join("\n"),
    offerCards: [
      card({
        id: "holiday-christmas-lights",
        category: "CHRISTMAS LIGHTS",
        offer: "35% OFF",
        subtitle: "Light Up Your Home & Save Big!",
        description:
          "Transform your home's exterior with beautiful holiday lighting and professional installation.",
        disclaimerTitle: "LET YOUR HOME SHINE — SAVE 35%!",
        disclaimerText:
          "Discount applies to eligible installation labor. Lights, clips, extension cords, and other materials are additional.",
        listTitle: "Eligible services include:",
        listItems: [
          "Roofline Christmas light installation",
          "Outdoor string lights & icicle lights",
          "Porch, balcony & railing decorations",
          "Outdoor garland lighting",
          "Window & entryway lighting",
          "Secure light installation and setup",
        ],
        icon: "tree",
      }),
      card({
        id: "holiday-outdoor-displays",
        category: "OUTDOOR DISPLAYS",
        offer: "25% OFF",
        subtitle: "Bring Your Holiday Decorations to Life!",
        description:
          "Create a magical outdoor display with professionally assembled and secured holiday decorations.",
        disclaimerTitle: "MORE HOLIDAY MAGIC — 25% OFF!",
        disclaimerText:
          "Discount applies to eligible assembly and installation labor. Decorations and anchoring materials are additional.",
        listTitle: "Eligible services include:",
        listItems: [
          "Light-up reindeer & holiday animal displays",
          "Inflatable Christmas decorations",
          "Santa, snowmen & seasonal figures",
          "Outdoor decoration assembly",
          "Ground stakes, anchors & secure placement",
          "Decoration positioning and basic setup",
        ],
        icon: "tree",
      }),
      card({
        id: "holiday-tree-setup",
        category: "TREE & SETUP",
        offer: "30% OFF",
        subtitle: "Your Holiday Setup, Made Easy!",
        description:
          "Let PrimeFix take care of your Christmas tree and larger holiday decorations from delivery to final setup.",
        disclaimerTitle: "LESS WORK. MORE CELEBRATION. SAVE 30%!",
        disclaimerText:
          "Discount applies to eligible labor and setup services. Tree purchase, decorations, delivery expenses, and additional materials are quoted separately.",
        listTitle: "Eligible services include:",
        listItems: [
          "Local Christmas tree pickup & delivery",
          "Artificial Christmas tree assembly",
          "Christmas tree lighting & decorating",
          "Large holiday decoration assembly",
          "Holiday display placement and setup",
          "Plug-in lighting connection and testing",
        ],
        icon: "tree",
      }),
      card({
        id: "holiday-backyard",
        category: "BACKYARD DECOR",
        offer: "30% OFF",
        subtitle: "Turn Your Backyard Into a Winter Wonderland!",
        description:
          "Make your backyard, patio, or outdoor entertaining space feel magical this holiday season.",
        disclaimerTitle: "YOUR BACKYARD. YOUR HOLIDAY MAGIC. 30% OFF!",
        disclaimerText:
          "Discount applies to eligible decorating and installation labor. Decorations, electrical upgrades, and specialty equipment are additional.",
        listTitle: "Eligible services include:",
        listItems: [
          "Backyard Christmas lighting",
          "Patio & pergola string lights",
          "Trees, shrubs & garden lighting",
          "Outdoor seating area decorations",
          "Fence and railing decorations",
          "Holiday-themed backyard displays",
          "Decorative garlands & festive accents",
        ],
        icon: "tree",
      }),
    ],
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

const plan = seeds.map((seed) => {
  const index = items.findIndex(seed.match);
  const item = index >= 0 ? items[index] : null;
  const existing = Array.isArray(item?.offerCards) ? item.offerCards : [];
  const hasCards = existing.length > 0;
  return {
    index,
    id: item?.id || null,
    title: item?.title || null,
    found: index >= 0,
    hasCards,
    existingCardCount: existing.length,
    willSeed: index >= 0 && !hasCards,
    cardCount: seed.offerCards.length,
    cardIds: seed.offerCards.map((c) => c.id),
  };
});

writeFileSync("migration/remaining-deal-offer-cards-plan.json", JSON.stringify(plan, null, 2));
console.log(JSON.stringify(plan, null, 2));

if (!APPLY) {
  console.log("Dry-run only. Re-run with --apply to write production D1.");
  process.exit(0);
}

if (plan.every((entry) => !entry.willSeed)) {
  console.log("Nothing to update — all target deals already have offer cards.");
  process.exit(0);
}

const next = structuredClone(document);
const applied = [];

for (let i = 0; i < seeds.length; i += 1) {
  const entry = plan[i];
  if (!entry.willSeed) continue;
  const target = next.copy.dealsPage.items[entry.index];
  target.offerCards = seeds[i].offerCards;
  target.offersFooter = null;
  target.text = seeds[i].text;
  applied.push({ id: target.id, index: entry.index, cards: seeds[i].offerCards.length });
}

const updatedAt = new Date().toISOString();
await queryD1("UPDATE documents SET body = ?, updated_at = ? WHERE id = ?", [
  JSON.stringify(next),
  updatedAt,
  "site",
]);

const verify = applied.map((entry) => {
  const item = next.copy.dealsPage.items[entry.index];
  return {
    id: entry.id,
    cards: Array.isArray(item.offerCards) ? item.offerCards.length : 0,
    firstOffer: item.offerCards?.[0]?.offer || null,
    textStart: String(item.text || "").slice(0, 48),
  };
});

console.log(JSON.stringify({ updatedAt, applied, verify }, null, 2));
