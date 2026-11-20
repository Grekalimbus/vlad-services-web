import type { CmsDocument } from "./types";

export type DealOfferCard = {
  id: string;
  category: string;
  offer: string;
  subtitle: string;
  description: string;
  disclaimerTitle: string;
  disclaimerText: string;
  detail: string;
  listTitle: string;
  listItems: string[];
  extra: string;
  icon: string;
  buttonLabel: string;
};

export type DealOffersFooter = {
  whyTitle: string;
  whyItems: string[];
  ctaTitle: string;
  ctaText: string;
  ctaButtonLabel: string;
};

export type DealPhoto = {
  image: string;
  alt: string;
  position: string;
};

export type DealItem = {
  id: string;
  title: string;
  text: string;
  media: string;
  kind: "image" | "video";
  alt: string;
  offerCards: DealOfferCard[];
  offersFooter: DealOffersFooter | null;
  photos: DealPhoto[];
};

export type DealsPageCopy = {
  title: string;
  items: DealItem[];
};

export const DEAL_OFFER_ICONS = [
  { value: "layers", label: "Layers / Bundle" },
  { value: "fan", label: "Fan / Lighting" },
  { value: "plug", label: "Outlet / Switch" },
  { value: "smart", label: "Smart home" },
  { value: "tv", label: "TV / Mounting" },
  { value: "wrench", label: "Handyman" },
  { value: "leaf", label: "Landscaping" },
  { value: "tree", label: "Holiday / Outdoor" },
] as const;

function pageOf(document: CmsDocument) {
  return (document.copy as { dealsPage?: DealsPageCopy }).dealsPage;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? item : ""));
}

function normalizeOfferCard(item: Partial<DealOfferCard> | null | undefined, index: number): DealOfferCard {
  return {
    id: item?.id?.trim() || `deal-offer-${index + 1}`,
    category: item?.category ?? "",
    offer: item?.offer ?? "",
    subtitle: item?.subtitle ?? "",
    description: item?.description ?? "",
    disclaimerTitle: item?.disclaimerTitle ?? "",
    disclaimerText: item?.disclaimerText ?? "",
    detail: item?.detail ?? "",
    listTitle: item?.listTitle ?? "",
    listItems: asStringList(item?.listItems),
    extra: item?.extra ?? "",
    icon: item?.icon ?? "layers",
    buttonLabel: item?.buttonLabel ?? "GET DEAL",
  };
}

function normalizePhotos(value: unknown): DealPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const photo = item as Partial<DealPhoto>;
    return [
      {
        image: photo.image ?? "",
        alt: photo.alt ?? "",
        position: photo.position || "center",
      },
    ];
  });
}

function normalizeFooter(value: Partial<DealOffersFooter> | null | undefined): DealOffersFooter | null {
  if (!value || typeof value !== "object") return null;
  return {
    whyTitle: value.whyTitle ?? "",
    whyItems: asStringList(value.whyItems),
    ctaTitle: value.ctaTitle ?? "",
    ctaText: value.ctaText ?? "",
    ctaButtonLabel: value.ctaButtonLabel ?? "GET YOUR BLACK FRIDAY QUOTE!",
  };
}

export function emptyDealOfferCard(): DealOfferCard {
  return {
    id: `deal-offer-${crypto.randomUUID().slice(0, 8)}`,
    category: "",
    offer: "",
    subtitle: "",
    description: "",
    disclaimerTitle: "",
    disclaimerText: "",
    detail: "",
    listTitle: "",
    listItems: [""],
    extra: "",
    icon: "layers",
    buttonLabel: "GET DEAL",
  };
}

export function ensureDealsPage(document: CmsDocument): CmsDocument {
  return document;
}

export function dealsPage(document: CmsDocument): DealsPageCopy {
  const page = pageOf(document);
  return {
    title: page?.title ?? "",
    items: (page?.items ?? []).map((item) => ({
      id: item?.id ?? "",
      title: item?.title ?? "",
      text: item?.text ?? "",
      media: item?.media ?? "",
      kind: item?.kind === "video" ? "video" : "image",
      alt: item?.alt ?? "",
      offerCards: (item?.offerCards ?? []).map((card, index) => normalizeOfferCard(card, index)),
      offersFooter: normalizeFooter(item?.offersFooter),
      photos: normalizePhotos(item?.photos),
    })),
  };
}
