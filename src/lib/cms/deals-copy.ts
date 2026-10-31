import type { CmsDocument } from "./types";

export const defaultDealsBackground = "/works/pexels-living.jpg";

type Heading = { lead?: string; accent?: string };

type DealsFields = {
  headingLead: string;
  headingAccent: string;
  background?: string;
  headings?: Record<string, Heading>;
};

function dealsOf(document: CmsDocument) {
  return document.copy?.home?.deals as DealsFields | undefined;
}

function titleKeys(document: CmsDocument) {
  const keys = new Set(["deals", "tv-deals"]);
  for (const category of document.serviceCategories ?? []) {
    if (!category.slug || category.slug === "tv-mounting") continue;
    keys.add(`${category.slug}-deals`);
  }
  return [...keys];
}

export function ensureDeals(document: CmsDocument): CmsDocument {
  const deals = dealsOf(document);
  if (!deals?.headingLead || !deals.headingAccent) return document;
  const keys = titleKeys(document);
  const headings = deals.headings ?? {};
  const ready =
    Boolean(deals.background?.trim()) &&
    keys.every((key) => headings[key]?.lead?.trim() && headings[key]?.accent?.trim());
  if (ready) return document;

  const next = structuredClone(document);
  const copy = dealsOf(next);
  if (!copy) return document;
  if (!copy.background?.trim()) copy.background = defaultDealsBackground;
  const nextHeadings = { ...copy.headings };
  for (const key of keys) {
    const current = nextHeadings[key] ?? {};
    nextHeadings[key] = {
      lead: current.lead?.trim() ? current.lead : copy.headingLead,
      accent: current.accent?.trim() ? current.accent : copy.headingAccent,
    };
  }
  copy.headings = nextHeadings;
  return next;
}

export function dealsBackground(document: CmsDocument) {
  return dealsOf(document)?.background?.trim() || defaultDealsBackground;
}

export function dealsHeading(document: CmsDocument, titleKey: string | null) {
  const deals = dealsOf(document);
  const shared = {
    lead: deals?.headingLead?.trim() || "Sign Up for",
    accent: deals?.headingAccent?.trim() || "Deals",
  };
  if (!titleKey) {
    return { ...shared, leadPath: "copy.home.deals.headingLead", accentPath: "copy.home.deals.headingAccent" };
  }
  const saved = deals?.headings?.[titleKey];
  return {
    lead: saved?.lead?.trim() || shared.lead,
    accent: saved?.accent?.trim() || shared.accent,
    leadPath: `copy.home.deals.headings.${titleKey}.lead`,
    accentPath: `copy.home.deals.headings.${titleKey}.accent`,
  };
}

export function dealsTitleKey(pathname: string) {
  if (pathname === "/") return "deals";
  const match = /^\/services\/([^/]+)\/?$/.exec(pathname);
  if (!match) return null;
  return match[1] === "tv-mounting" ? "tv-deals" : `${match[1]}-deals`;
}
