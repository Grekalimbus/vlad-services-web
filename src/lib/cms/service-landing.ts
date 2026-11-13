import type { CmsDocument } from "./types";
import {
  electricalLandingFrom,
  type ElectricalLanding,
} from "./electrical-landing";

type LandingDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    serviceLanding?: Record<string, ElectricalLanding | undefined>;
  };
};

export function serviceLandingFrom(
  document: CmsDocument,
  category: { id: string; slug: string; name: string },
): ElectricalLanding {
  if (category.id === "electrical" || category.slug === "electrical") return electricalLandingFrom(document);
  const saved = (document as LandingDocument).copy?.serviceLanding?.[category.id];
  if (!saved) return electricalLandingFrom({ ...document, copy: { ...document.copy, serviceLanding: {} } } as CmsDocument);
  return {
    icons: saved.icons ?? [],
    description: saved.description ?? { title: "", subtitle: "", imageAlt: "", body: "" },
    stepsHeading: saved.stepsHeading ?? "",
    steps: saved.steps ?? [],
    dealsBody: saved.dealsBody ?? "",
    prices: saved.prices ?? [],
    featureRows: saved.featureRows,
    faq: saved.faq ?? { headingLead: "", headingAccent: "", items: [] },
  };
}

export function ensureServiceLandings(document: CmsDocument): CmsDocument {
  return document;
}
