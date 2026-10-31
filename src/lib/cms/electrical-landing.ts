import type { CmsDocument } from "./types";

export type ElectricalLanding = {
  icons: { src: string; alt: string; text: string }[];
  description: {
    title: string;
    subtitle: string;
    imageAlt: string;
    body: string;
  };
  stepsHeading: string;
  steps: { title: string; text: string }[];
  dealsBody: string;
  prices: { amount: number; label: string }[];
  faq: {
    headingLead: string;
    headingAccent: string;
    items: { q: string; a: string }[];
  };
};

export const electricalLanding: ElectricalLanding = {
  icons: [
    { src: "/services/icons/chandelier.svg", alt: "Chandelier", text: "Chandeliers hung level" },
    { src: "/services/icons/ceiling-light.svg", alt: "Ceiling light", text: "Ceiling lights, flush fit" },
    { src: "/services/icons/ceiling-fan.svg", alt: "Ceiling fan", text: "Ceiling fans, braced" },
    { src: "/services/icons/outlet.svg", alt: "Outlet", text: "Outlets set flat" },
    { src: "/services/icons/dimmer-switch.svg", alt: "Dimmer switch", text: "Dimmers for the fixture" },
    { src: "/services/icons/breaker-panel.svg", alt: "Breaker panel", text: "Panels checked on site" },
  ],
  description: {
    title: "Electrician",
    subtitle: "Fixtures, fans, outlets, and switches, hung level and tested before we leave.",
    imageAlt: "Electrician on a ladder installing a chandelier",
    body: "An electrician starts with the room, not the part. We look at where the light should fall and which switch you actually reach. Chandeliers and pendants come down carefully. The junction box is checked for a brace that can hold the weight, and the new piece is hung so the canopy sits flush and every bulb comes on together. Ceiling fans get the same visit: the support has to carry the fan, and the control has to match the fan you bought.\n\nOutlets and switches are opened instead of guessed at. We check the circuit, replace devices that are worn, and set the new ones so the plate lies flat. When a room needs another outlet, the run follows the existing circuit when that is the safe choice. The wall is opened only as far as the wire needs, then closed and left ready for paint.\n\nBefore we leave, every connection is tested. Lights, fan speeds, and outlets are checked under load. Covers go back on, the ladder comes down, and the floor is swept. You get a fixture that stays put, a switch that feels solid, and a price that was agreed before the drive to your house.",
  },
  stepsHeading: "What happens after the quiz?",
  steps: [
    {
      title: "Take the 1-minute quiz",
      text: "Pick your setup and see each item priced. The $30 quiz discount is included.",
    },
    {
      title: "We call and agree on the price",
      text: "Your price is set on the call, before a technician drives out. Calls daily 8am–10pm local time.",
    },
    {
      title: "We show up on time",
      text: "Same day when slots are open. About an hour on site: leveled, load-tested, cleaned up.",
    },
    {
      title: "Then you pay",
      text: "After the job, no deposit. Insured, with a 3-year warranty on our work.",
    },
  ],
  dealsBody:
    "These photos are finished electrical jobs in homes around San Diego and the nearby cities. Chandeliers sit centered over dining tables. Pendant lights line up over a kitchen island. Ceiling fans clear the doorway, and outlet and switch plates lie flat on the wall. Each picture is the end of one visit: the old fixture is down, the box is secure, the new piece is level, and the circuit was tested before the ladder was packed.\n\nMost of this work takes about an hour when the fixture is already chosen. We bring the hardware for a standard hang, cover the floor, and do not leave wire nuts, blades, or packing behind. If a box is loose, a fan needs a new brace, or a switch is on the wrong circuit, we stop and say so before any extra work begins. The price set on the call is the price for the job in the photo. Looking through the set is the quickest way to judge the finish you can expect in your own room.",
  prices: [
    { amount: 125, label: "Chandelier" },
    { amount: 95, label: "Flush Fit Light" },
    { amount: 120, label: "Ceiling Fan" },
    { amount: 110, label: "Outlet" },
    { amount: 100, label: "Dimmer/Switch" },
    { amount: 75, label: "Panel Check/Reset" },
  ],
  faq: {
    headingLead: "QUESTIONS &",
    headingAccent: "ANSWERS",
    items: [
      {
        q: "What services does PrimeFix provide?",
        a: "PrimeFix provides professional home services including TV mounting, electrical work, handyman services, painting, appliance repair, plumbing, landscaping, and more. Visit our Services page to explore everything we offer.",
      },
      {
        q: "Do you offer same-day service?",
        a: "Yes. Same-day appointments are available for many of our services depending on technician availability and your location. Contact us as early as possible for the best chance of same-day service.",
      },
      {
        q: "How quickly will you respond after I request a quote?",
        a: "We typically respond within 30 minutes after receiving your request during business hours. For faster assistance, you can also call us directly.",
      },
      {
        q: "Is PrimeFix insured?",
        a: "Yes. PrimeFix is an insured home service company, so you can feel confident when inviting our professionals into your home or business.",
      },
      {
        q: "Do you provide a warranty on your work?",
        a: "Yes. We stand behind our work with a 3-Year Workmanship Warranty on qualifying services. Specific warranty coverage may vary depending on the service, materials, and equipment involved.",
      },
      {
        q: "How much do your services cost?",
        a: "Pricing depends on the type of service, project size, materials, and complexity of the work. You can request a quote online, and our team will review your project and provide pricing before the work begins.",
      },
      {
        q: "Do you provide materials and parts?",
        a: "Yes. Depending on the project, PrimeFix can provide or help source the necessary materials, parts, mounts, hardware, and other supplies. Any additional material costs will be discussed with you before installation or repair.",
      },
    ],
  },
};

type LandingDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    serviceLanding?: {
      electrical?: ElectricalLanding;
    };
  };
};

function mergeIcons(saved: ElectricalLanding["icons"] | undefined) {
  const source = saved?.length ? saved : electricalLanding.icons;
  return source.map((icon, index) => {
    const fallback = electricalLanding.icons[index];
    return {
      src: icon.src || fallback?.src || "",
      alt: icon.alt || fallback?.alt || "",
      text: icon.text || fallback?.text || icon.alt || "",
    };
  });
}

function priceList(
  saved: ElectricalLanding["prices"] | undefined,
  fallback: ElectricalLanding["prices"],
) {
  if (!saved?.length) return fallback;
  return saved.map((item) => ({
    amount: Number(item.amount) || 0,
    label: item.label || "",
  }));
}

function mergeFaq(saved: ElectricalLanding["faq"] | undefined) {
  if (!saved?.items?.length) return electricalLanding.faq;
  return {
    headingLead: saved.headingLead || electricalLanding.faq.headingLead,
    headingAccent: saved.headingAccent || electricalLanding.faq.headingAccent,
    items: saved.items.map((item) => ({ q: item.q || "", a: item.a || "" })),
  };
}

function savedLanding(document: CmsDocument) {
  return (document as LandingDocument).copy?.serviceLanding?.electrical;
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

function isComplete(landing: ElectricalLanding | undefined): landing is ElectricalLanding {
  return hasLandingBody(landing) && Boolean(landing.faq?.headingLead && landing.faq.items?.length);
}

export function electricalLandingFrom(document: CmsDocument): ElectricalLanding {
  const saved = savedLanding(document);
  if (!saved) return electricalLanding;
  return {
    ...electricalLanding,
    ...saved,
    description: { ...electricalLanding.description, ...saved.description },
    icons: mergeIcons(saved.icons),
    steps: saved.steps?.length ? saved.steps : electricalLanding.steps,
    prices: priceList(saved.prices, electricalLanding.prices),
    dealsBody: saved.dealsBody || electricalLanding.dealsBody,
    stepsHeading: saved.stepsHeading || electricalLanding.stepsHeading,
    faq: mergeFaq(saved.faq),
  };
}

export function ensureElectricalLanding(document: CmsDocument): CmsDocument {
  if (!document?.copy) return document;
  const saved = savedLanding(document);
  if (isComplete(saved)) return document;
  const next = structuredClone(document) as LandingDocument;
  const current = savedLanding(next);
  const electrical = hasLandingBody(current)
    ? {
        ...structuredClone(electricalLanding),
        ...current,
        description: { ...electricalLanding.description, ...current.description },
        icons: mergeIcons(current.icons),
        steps: current.steps?.length ? current.steps : electricalLanding.steps,
        prices: priceList(current.prices, electricalLanding.prices),
        dealsBody: current.dealsBody || electricalLanding.dealsBody,
        stepsHeading: current.stepsHeading || electricalLanding.stepsHeading,
        faq: mergeFaq(current.faq),
      }
    : structuredClone(electricalLanding);
  next.copy.serviceLanding = {
    ...next.copy.serviceLanding,
    electrical,
  };
  return next;
}
