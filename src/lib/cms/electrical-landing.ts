import type { CmsDocument } from "./types";

export type LandingFeatureRow = {
  title: string;
  body: string;
  photos: [{ src: string; alt: string }, { src: string; alt: string }];
};

export type ElectricalLanding = {
  iconsTitle?: string;
  iconsSubtitle?: string;
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
  prices: { amount: number; label: string; suffix?: string; subtitle?: string }[];
  featureRows?: LandingFeatureRow[];
  faq: {
    headingLead: string;
    headingAccent: string;
    items: { q: string; a: string }[];
  };
};


type LandingDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    serviceLanding?: {
      electrical?: ElectricalLanding;
    };
  };
};

function normalizeIconSrc(src: string) {
  return src.replace(/\/services\/icons\/([^/?#]+)\.svg\b/i, "/services/icons/$1.webp");
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



function savedLanding(document: CmsDocument) {
  return (document as LandingDocument).copy?.serviceLanding?.electrical;
}



function emptyLanding(): ElectricalLanding {
  return {
    iconsTitle: "",
    iconsSubtitle: "",
    icons: [],
    description: { title: "", subtitle: "", imageAlt: "", body: "" },
    stepsHeading: "",
    steps: [],
    dealsBody: "",
    prices: [],
    faq: { headingLead: "", headingAccent: "", items: [] },
  };
}

export function electricalLandingFrom(document: CmsDocument): ElectricalLanding {
  const saved = savedLanding(document);
  if (!saved) return emptyLanding();
  return {
    iconsTitle: saved.iconsTitle ?? "",
    iconsSubtitle: saved.iconsSubtitle ?? "",
    icons: (saved.icons ?? []).map((icon) => ({
      src: normalizeIconSrc(icon.src || ""),
      alt: icon.alt || "",
      text: icon.text || "",
    })),
    description: {
      title: saved.description?.title ?? "",
      subtitle: saved.description?.subtitle ?? "",
      imageAlt: saved.description?.imageAlt ?? "",
      body: saved.description?.body ?? "",
    },
    stepsHeading: saved.stepsHeading ?? "",
    steps: saved.steps ?? [],
    dealsBody: saved.dealsBody ?? "",
    prices: (saved.prices ?? []).map((item) => ({
      amount: typeof item.amount === "number" ? item.amount : Number.NaN,
      label: item.label ?? "",
      suffix: item.suffix ?? "",
      subtitle: item.subtitle ?? "",
    })),
    featureRows: saved.featureRows,
    faq: {
      headingLead: saved.faq?.headingLead ?? "",
      headingAccent: saved.faq?.headingAccent ?? "",
      items: saved.faq?.items ?? [],
    },
  };
}

export function ensureElectricalLanding(document: CmsDocument): CmsDocument {
  return document;
}
