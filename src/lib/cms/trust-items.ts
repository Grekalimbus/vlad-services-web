import type { CmsDocument } from "./types";

const businessYears = {
  id: "business",
  value: 4,
  suffix: " years",
  label: "in Business",
} as const;

export function ensureTrustItems(document: CmsDocument): CmsDocument {
  if (!Array.isArray(document.trustItems)) return document;
  if (document.trustItems.some((item) => item.id === businessYears.id)) return document;
  const next = structuredClone(document);
  next.trustItems.push({ ...businessYears });
  return next;
}
