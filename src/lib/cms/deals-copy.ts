import type { CmsDocument } from "./types";

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


export function ensureDeals(document: CmsDocument): CmsDocument {
  return document;
}

export function dealsBackground(document: CmsDocument) {
  return dealsOf(document)?.background?.trim() ?? "";
}

export function dealsHeading(document: CmsDocument, titleKey: string | null) {
  const deals = dealsOf(document);
  const shared = {
    lead: deals?.headingLead?.trim() ?? "",
    accent: deals?.headingAccent?.trim() ?? "",
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
