import type { CmsDocument } from "./types";
import {
  electricalLanding,
  electricalLandingFrom,
  ensureElectricalLanding,
  type ElectricalLanding,
  type LandingFeatureRow,
} from "./electrical-landing";

type LandingDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    serviceLanding?: Record<string, ElectricalLanding | undefined>;
  };
};

const steps = () => electricalLanding.steps.map((step) => ({ ...step }));

const handymanLanding: ElectricalLanding = {
  icons: [
    { src: "lucide:Hammer", alt: "Furniture assembly", text: "Furniture assembled square" },
    { src: "lucide:Drill", alt: "Wall anchors", text: "Anchors set in the stud" },
    { src: "lucide:Sofa", alt: "Furniture moving", text: "Pieces shifted in the room" },
    { src: "lucide:DoorOpen", alt: "Door adjustment", text: "Doors adjusted to latch" },
    { src: "lucide:Ruler", alt: "Shelving", text: "Shelves hung level" },
    { src: "lucide:Wrench", alt: "Small repairs", text: "Small repairs in one visit" },
  ],
  description: {
    title: "Handyman",
    subtitle: "Assembly, doors, shelves, and the small repairs on your list.",
    imageAlt: "Handyman finishing a home repair",
    body: "A handyman visit starts with the list you already have. We walk the room, confirm which pieces are in the job, and do the work that was priced on the call. Furniture is assembled square, doors are adjusted so they latch, and shelves are anchored into a stud or a rated anchor before anything is loaded.\n\nSmall wall repairs, loose hardware, and fixture swaps stay in the same visit when the parts are on site. We cover the floor, pack the hardware we remove, and leave the area swept. The price set on the call is the price for the work we agreed to. If something else is loose, we say so before adding it.",
  },
  stepsHeading: electricalLanding.stepsHeading,
  steps: steps(),
  dealsBody: "Finished handyman jobs: assembled furniture, adjusted doors, level shelves, and small repairs left swept.",
  prices: [
    { amount: 75, label: "Drywal Repair", suffix: "+", subtitle: "" },
    { amount: 70, label: "Furniture Assembly", suffix: "", subtitle: "" },
    { amount: 65, label: "Smart Cameras/Devices", suffix: "", subtitle: "" },
    { amount: 95, label: "Door & Window Repair", suffix: "+", subtitle: "" },
    { amount: 35, label: "Picture, Mirror, Art & Shelfs", suffix: "+", subtitle: "" },
    { amount: 90, label: "Plumbing Services", suffix: "+", subtitle: "" },
  ],
  featureRows: [],
  faq: {
    headingLead: "QUESTIONS &",
    headingAccent: "ANSWERS",
    items: [
      {
        q: "What does a handyman visit include?",
        a: "The visit covers the items we priced on the call: assembly, door adjustments, shelving, anchors, and other small repairs that fit one stop.",
      },
      {
        q: "Do I need to buy the parts first?",
        a: "Bring the furniture, shelf, or hardware if you already have it. If a part is missing, we tell you before adding anything to the job.",
      },
      {
        q: "Can you assemble furniture the same day?",
        a: "Same-day assembly is available when a slot is open and the boxes are already at the house.",
      },
      {
        q: "How do you price a small repair?",
        a: "The price is set on the call from the list you describe. Extra items are quoted before we start them.",
      },
      {
        q: "Are you insured for handyman work?",
        a: "Yes. PrimeFix is insured, and qualifying work includes a 3-year workmanship warranty.",
      },
      {
        q: "What should I have ready before you arrive?",
        a: "Clear a path to the room, unbox what you can, and have the hardware bag where we can see it.",
      },
      {
        q: "Can you handle several small fixes in one visit?",
        a: "Yes. If the items fit one stop and were priced on the call, we complete them in the same visit.",
      },
      {
        q: "How long does a handyman visit usually take?",
        a: "Most lists finish in about one to two hours, depending on how many items are on the job and whether parts are already on site.",
      },
    ],
  },
};

const painterLanding: ElectricalLanding = {
  icons: [
    { src: "lucide:PaintRoller", alt: "Interior walls", text: "Walls rolled even" },
    { src: "lucide:Paintbrush", alt: "Trim", text: "Trim and doors cut in" },
    { src: "lucide:Palette", alt: "Color", text: "Color matched on site" },
    { src: "lucide:Layers", alt: "Wall prep", text: "Nail holes patched first" },
    { src: "lucide:House", alt: "Exterior", text: "Exterior walls coated" },
    { src: "lucide:Droplets", alt: "Touch up", text: "Touch-ups in the same color" },
  ],
  description: {
    title: "Painter",
    subtitle: "Interior and exterior paint, with the room protected before the first cut-in.",
    imageAlt: "Painter finishing an interior wall",
    body: "Painting starts with the surface, not the roller. We look at the walls, the trim, and what needs to be protected before a can is opened. Floors and furniture are covered, outlets are taped, and edges are cut in so the color stops where it should.\n\nMost rooms are a one-visit job when the paint is already chosen and the walls are sound. We patch small nail holes, sand them smooth, and roll so the finish reads even in daylight. The price set on the call covers the rooms we walked through, and extra walls are quoted before we start them.",
  },
  stepsHeading: electricalLanding.stepsHeading,
  steps: steps(),
  dealsBody: "Finished paint jobs: walls rolled even, trim cut in, and the room left covered, then cleaned.",
  prices: [
    { amount: 350, label: "Interior & Exterior", suffix: "+", subtitle: "Small painting projects" },
    { amount: 75, label: "Brush, Roller & Sprayer", suffix: "/hr", subtitle: "Painting labor" },
    { amount: 200, label: "Surface Painting", suffix: "+", subtitle: "Drywall, stucco & more" },
    { amount: 125, label: "Doors, Trim & Windows", suffix: "+", subtitle: "Per item / section" },
    { amount: 150, label: "Cabinets & Furniture", suffix: "+", subtitle: "Per piece" },
    { amount: 95, label: "Rooms & Touch-Ups", suffix: "+", subtitle: "Small touch-up work" },
  ],
  faq: {
    headingLead: "QUESTIONS &",
    headingAccent: "ANSWERS",
    items: [
      {
        q: "Do you paint interiors and exteriors?",
        a: "Yes. Interior rooms, trim, and exterior walls are all booked the same way: a call, a price, then the visit.",
      },
      {
        q: "Do I need to supply the paint?",
        a: "You can supply the paint you already chose. If you want us to bring it, we confirm the color and the cost before the visit.",
      },
      {
        q: "How do you protect floors and furniture?",
        a: "Floors, furniture, and outlets are covered or taped before any paint goes on the wall.",
      },
      {
        q: "Can you paint a single room?",
        a: "Yes. One room is a normal job when the paint is on site and the walls are sound.",
      },
      {
        q: "Do you patch holes before painting?",
        a: "Small nail holes and shallow dings are filled and sanded as part of prep. Larger repairs are quoted first.",
      },
      {
        q: "How long does a room usually take?",
        a: "A typical room is finished in one visit. Drying time depends on the paint and the weather.",
      },
    ],
  },
};

const applianceLanding: ElectricalLanding = {
  icons: [
    { src: "lucide:Refrigerator", alt: "Refrigerator", text: "Refrigerators checked" },
    { src: "lucide:WashingMachine", alt: "Washer", text: "Washers tested under load" },
    { src: "lucide:AirVent", alt: "Dryer", text: "Dryers checked for heat" },
    { src: "lucide:Microwave", alt: "Microwave", text: "Microwaves opened and tested" },
    { src: "lucide:CookingPot", alt: "Oven", text: "Ovens and ranges serviced" },
    { src: "lucide:Plug", alt: "Diagnostic", text: "Diagnostics before parts" },
  ],
  description: {
    title: "Appliance Expert",
    subtitle: "Refrigerators, laundry, and kitchen appliances, tested before any part is ordered.",
    imageAlt: "Technician servicing a home appliance",
    body: "An appliance visit starts with what the machine is doing, not a parts guess. We ask what failed, check the model, and test the circuit and the obvious controls before anything is taken apart. Refrigerators, washers, dryers, dishwashers, and ovens are the usual jobs.\n\nIf a common part will bring it back, we say what it costs before it is ordered. If the repair is not worth the appliance, we say that too. The price set on the call is the price for the visit we agreed to.",
  },
  stepsHeading: electricalLanding.stepsHeading,
  steps: steps(),
  dealsBody: "Appliance visits start with a diagnostic. Parts are quoted before they are ordered.",
  prices: [
    { amount: 79, label: "Diagnostic" },
    { amount: 149, label: "Refrigerator" },
    { amount: 129, label: "Washer" },
    { amount: 129, label: "Dryer" },
    { amount: 119, label: "Dishwasher" },
    { amount: 139, label: "Oven" },
  ],
  faq: {
    headingLead: "QUESTIONS &",
    headingAccent: "ANSWERS",
    items: [
      {
        q: "Which appliances do you service?",
        a: "Refrigerators, washers, dryers, dishwashers, microwaves, and ovens are the jobs we book most often.",
      },
      {
        q: "Do you repair or replace?",
        a: "We repair when a part will bring the machine back. If replacement makes more sense, we say so before any extra work.",
      },
      {
        q: "Is there a diagnostic fee?",
        a: "Yes. The diagnostic is its own price, set on the call, before a technician drives out.",
      },
      {
        q: "Do you stock common parts?",
        a: "Some common parts are on the truck. Anything that has to be ordered is priced before we order it.",
      },
      {
        q: "Can you work on a built-in appliance?",
        a: "Yes, when we can reach the machine safely. If it has to be pulled out, we say that before we start.",
      },
      {
        q: "What if the appliance is not worth repairing?",
        a: "We stop after the diagnostic and tell you. You do not have to approve a repair that does not make sense.",
      },
    ],
  },
};

const landscaperLanding: ElectricalLanding = {
  icons: [
    { src: "lucide:TreePine", alt: "Hedge trim", text: "Hedges cut to a line" },
    { src: "lucide:Flower2", alt: "Planting", text: "Plants set in the bed" },
    { src: "lucide:Shovel", alt: "Mulch", text: "Beds cleaned and mulched" },
    { src: "lucide:Leaf", alt: "Cleanup", text: "Yard debris hauled off" },
    { src: "lucide:Droplets", alt: "Irrigation", text: "Irrigation checked" },
    { src: "lucide:Scissors", alt: "Edging", text: "Lawn edges cut clean" },
  ],
  description: {
    title: "Landscaper",
    subtitle: "Trim, cleanup, planting, and a simple check of the yard you already have.",
    imageAlt: "Landscaper trimming a yard",
    body: "A landscaping visit starts with the yard as it is. We walk the beds, the edges, and whatever is overgrown, then do the work that was priced on the call. Hedges are cut back to a line you can see, lawns are edged, and debris is piled so it can leave with us.\n\nPlanting, mulch, and a simple irrigation check fit the same visit when the materials are on site. We do not expand the job into a redesign without saying so first. The price set on the call is the price for the yard we looked at.",
  },
  stepsHeading: electricalLanding.stepsHeading,
  steps: steps(),
  dealsBody: "Yard visits: hedges cut back, edges cleaned, and debris piled to leave with the crew.",
  prices: [
    { amount: 120, label: "Hedge Trim" },
    { amount: 95, label: "Planting" },
    { amount: 110, label: "Mulch Bed" },
    { amount: 85, label: "Yard Cleanup" },
    { amount: 100, label: "Irrigation Check" },
    { amount: 75, label: "Lawn Edge" },
  ],
  featureRows: [
    {
      title: "Hedges and planting",
      body: "Overgrown hedges are cut back to a clean line you can see from the street. New plants go in the bed you already have, set at the right depth and watered in before we leave. The shape of the yard stays yours — we finish the work that was priced on the call.",
      photos: [
        { src: "/works/landscaping-hedge.jpg", alt: "Freshly trimmed hedge along a front walk" },
        { src: "/works/landscaping-plants.jpg", alt: "New plants set in a prepared garden bed" },
      ],
    },
    {
      title: "Beds cleaned and mulched",
      body: "Beds are cleared of weeds and spent growth, then dressed with mulch so the edges read finished. Debris from the cleanup is piled for haul-off with the crew. You get a yard that looks tended, not redesigned.",
      photos: [
        { src: "/works/landscaping-mulch.jpg", alt: "Garden bed cleaned and covered with fresh mulch" },
        { src: "/works/landscaping-cleanup.jpg", alt: "Yard debris piled after a cleanup visit" },
      ],
    },
    {
      title: "Edges and irrigation",
      body: "Lawn edges are cut so the grass stops where the bed begins. A simple irrigation check confirms heads are aimed and running. Small adjustments stay in the visit; anything that needs parts or a deeper fix is quoted before we start it.",
      photos: [
        { src: "/works/landscaping-lawn.jpg", alt: "Clean lawn edge along a landscaped bed" },
        { src: "/works/landscaping-beds.jpg", alt: "Landscaped yard beds with irrigation in place" },
      ],
    },
  ],
  faq: {
    headingLead: "QUESTIONS &",
    headingAccent: "ANSWERS",
    items: [
      {
        q: "What landscaping work do you take on?",
        a: "Hedge trimming, lawn edging, bed cleanup, planting, mulch, and a simple irrigation check.",
      },
      {
        q: "Do you bring your own tools?",
        a: "Yes. We bring the tools for the work priced on the call. Plants and mulch are confirmed before the visit if you want us to supply them.",
      },
      {
        q: "Can you do a one-time cleanup?",
        a: "Yes. A single cleanup is a normal visit. Ongoing service is quoted separately.",
      },
      {
        q: "Do you haul away green waste?",
        a: "Clippings from the job we priced are piled and hauled with the crew. Extra debris is quoted first.",
      },
      {
        q: "How do you price a yard visit?",
        a: "The price is set on the call from the size of the yard and the list of work. We do not add beds after we arrive without asking.",
      },
      {
        q: "Can you plant something I already bought?",
        a: "Yes, when the plants are at the house and the bed is part of the visit we priced.",
      },
    ],
  },
};

const presets: Record<string, ElectricalLanding> = {
  handyman: handymanLanding,
  painter: painterLanding,
  "appliance-expert": applianceLanding,
  landscaper: landscaperLanding,
};

function genericLanding(name: string): ElectricalLanding {
  const title = name.trim() || "Service";
  return {
    icons: handymanLanding.icons.map((icon) => ({ ...icon })),
    description: {
      title,
      subtitle: "",
      imageAlt: title,
      body: `${title} is booked the same way as the rest of the work: a short call, a price, then the visit. We confirm what is included before anyone drives out, and we say so before adding anything that was not on that list.\n\nThe visit covers the work we agreed to, then the area is left clean. If the job needs more than the call described, we stop and quote that first.`,
    },
    stepsHeading: electricalLanding.stepsHeading,
    steps: steps(),
    dealsBody: `${title} visits follow the price set on the call.`,
    prices: handymanLanding.prices.map((item) => ({ ...item })),
    faq: {
      headingLead: "QUESTIONS &",
      headingAccent: "ANSWERS",
      items: [
        {
          q: `What does a ${title} visit include?`,
          a: "The visit covers the work priced on the call. Anything extra is quoted before we start it.",
        },
        {
          q: "Do you offer same-day service?",
          a: "Same-day visits are available when a slot is open and the job fits one stop.",
        },
        {
          q: "How quickly will you call back?",
          a: "We usually call back within 30 minutes during business hours.",
        },
        {
          q: "Is PrimeFix insured?",
          a: "Yes. PrimeFix is insured for the work we book.",
        },
        {
          q: "Do you warranty the work?",
          a: "Qualifying work includes a 3-year workmanship warranty.",
        },
        {
          q: "How is the price set?",
          a: "The price is agreed on the call, before a technician drives to the house.",
        },
      ],
    },
  };
}

function landingPreset(category: { id: string; slug: string; name: string }) {
  return presets[category.slug] ?? presets[category.id] ?? genericLanding(category.name);
}

function normalizePriceSuffix(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.slice(0, 8);
}

function normalizePriceSubtitle(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, 120);
}

function priceItem(
  current: ElectricalLanding["prices"][number] | undefined,
  fallback?: ElectricalLanding["prices"][number],
) {
  return {
    amount: Number(current?.amount) || Number(fallback?.amount) || 0,
    label: current?.label || fallback?.label || "",
    suffix: normalizePriceSuffix(current?.suffix, fallback?.suffix || ""),
    subtitle: normalizePriceSubtitle(current?.subtitle, fallback?.subtitle || ""),
  };
}

function priceList(saved: ElectricalLanding["prices"] | undefined, fallback: ElectricalLanding["prices"]) {
  if (!saved?.length) {
    return fallback.map((item) => ({
      ...item,
      suffix: item.suffix || "",
      subtitle: item.subtitle || "",
    }));
  }
  const merged = fallback.map((item, index) => priceItem(saved[index], item));
  if (saved.length > fallback.length) {
    for (let index = fallback.length; index < saved.length; index += 1) {
      merged.push(priceItem(saved[index]));
    }
  }
  return merged;
}

function mergeFaq(
  defaults: ElectricalLanding["faq"],
  saved: ElectricalLanding["faq"] | undefined,
): ElectricalLanding["faq"] {
  if (!saved?.items?.length) return structuredClone(defaults);
  const items = saved.items.map((item) => ({ q: item.q || "", a: item.a || "" }));
  if (items.length < defaults.items.length) {
    for (let index = items.length; index < defaults.items.length; index += 1) {
      items.push({ ...defaults.items[index] });
    }
  }
  return {
    headingLead: saved.headingLead || defaults.headingLead,
    headingAccent: saved.headingAccent || defaults.headingAccent,
    items,
  };
}

function mergeFeatureRows(
  defaults: ElectricalLanding["featureRows"],
  saved: ElectricalLanding["featureRows"],
): ElectricalLanding["featureRows"] {
  if (!defaults?.length) {
    if (!saved?.length) return undefined;
    return saved.map((row) => ({
      title: row.title || "",
      body: row.body || "",
      photos: [
        { src: row.photos?.[0]?.src || "", alt: row.photos?.[0]?.alt || "" },
        { src: row.photos?.[1]?.src || "", alt: row.photos?.[1]?.alt || "" },
      ] as LandingFeatureRow["photos"],
    }));
  }

  return defaults.map((base, index) => {
    const row = saved?.[index];
    if (!row) return structuredClone(base);
    return {
      title: row.title || base.title,
      body: row.body || base.body,
      photos: [
        {
          src: row.photos?.[0]?.src || base.photos[0].src,
          alt: row.photos?.[0]?.alt || base.photos[0].alt,
        },
        {
          src: row.photos?.[1]?.src || base.photos[1].src,
          alt: row.photos?.[1]?.alt || base.photos[1].alt,
        },
      ] as LandingFeatureRow["photos"],
    };
  });
}

function missingFeatureRows(landing: ElectricalLanding | undefined, defaults: ElectricalLanding) {
  if (!defaults.featureRows?.length) return false;
  return !landing?.featureRows?.length || landing.featureRows.length < defaults.featureRows.length;
}

function mergeLanding(defaults: ElectricalLanding, saved: ElectricalLanding | undefined): ElectricalLanding {
  const base = structuredClone(defaults);
  if (!saved) return base;
  return {
    ...base,
    ...saved,
    description: { ...base.description, ...saved.description },
    icons: (saved.icons?.length ? saved.icons : base.icons).map((icon, index) => {
      const fallback = base.icons[index];
      const src = icon.src || fallback?.src || "";
      return {
        src: src.replace(/\/services\/icons\/([^/?#]+)\.svg\b/i, "/services/icons/$1.webp"),
        alt: icon.alt || fallback?.alt || "",
        text: icon.text || fallback?.text || icon.alt || "",
      };
    }),
    steps: saved.steps?.length ? saved.steps : base.steps,
    prices: priceList(saved.prices, base.prices),
    dealsBody: saved.dealsBody || base.dealsBody,
    stepsHeading: saved.stepsHeading || base.stepsHeading,
    featureRows: mergeFeatureRows(base.featureRows, saved.featureRows),
    faq: mergeFaq(base.faq, saved.faq),
  };
}

function hasLandingBody(landing: ElectricalLanding | undefined): landing is ElectricalLanding {
  return Boolean(
    landing?.description?.body &&
      landing.description.title &&
      landing.stepsHeading &&
      landing.dealsBody &&
      Array.isArray(landing.icons) &&
      landing.icons.length >= 6 &&
      Array.isArray(landing.steps) &&
      landing.steps.length >= 4,
  );
}

function isComplete(landing: ElectricalLanding | undefined, defaults: ElectricalLanding) {
  return (
    hasLandingBody(landing) &&
    Boolean(landing.faq?.headingLead && landing.faq.items?.length) &&
    (landing.prices?.length ?? 0) >= Math.min(6, defaults.prices.length) &&
    (landing.faq?.items?.length ?? 0) >= defaults.faq.items.length
  );
}

export function serviceLandingFrom(
  document: CmsDocument,
  category: { id: string; slug: string; name: string },
): ElectricalLanding {
  if (category.id === "electrical" || category.slug === "electrical") return electricalLandingFrom(document);
  const defaults = landingPreset(category);
  const saved = (document as LandingDocument).copy?.serviceLanding?.[category.id];
  return mergeLanding(defaults, saved);
}

export function ensureServiceLandings(document: CmsDocument): CmsDocument {
  const base = ensureElectricalLanding(document);
  if (!base?.copy || !Array.isArray(base.serviceCategories)) return base;
  const source = base as LandingDocument;
  const pending = base.serviceCategories.filter(
    (category) => category.slug !== "tv-mounting" && category.id !== "tv-mounting" && category.slug !== "electrical" && category.id !== "electrical",
  );
  const needsWork = pending.some((category) => {
    const defaults = landingPreset(category);
    const current = source.copy.serviceLanding?.[category.id];
    return !isComplete(current, defaults) || missingFeatureRows(current, defaults);
  });
  if (!needsWork) return base;

  const next = structuredClone(base) as LandingDocument;
  next.copy.serviceLanding = { ...next.copy.serviceLanding };
  for (const category of pending) {
    const current = next.copy.serviceLanding?.[category.id];
    const defaults = landingPreset(category);
    if (isComplete(current, defaults) && !missingFeatureRows(current, defaults)) continue;
    next.copy.serviceLanding[category.id] = hasLandingBody(current) ? mergeLanding(defaults, current) : structuredClone(defaults);
  }
  return next;
}
