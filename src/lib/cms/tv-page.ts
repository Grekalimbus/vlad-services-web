import type { CmsDocument } from "./types";

export type TvSlide = { image: string; alt: string; position: string };

export type TvShowcaseCard = { title: string; text: string; image: string; alt: string; position: string };

type AdditionalCard = CmsDocument["copy"]["additionals"]["cards"][number] & { slides?: TvSlide[] };

export type TvOfferCopy = {
  title: string;
  subtitle: string;
  button: string;
  note: string;
};

export type TvQuizOption = { id: string; title: string; text: string; accentText?: string };

export type TvQuizStep = { id: string; lead: string; accent: string; options: TvQuizOption[]; multiple?: boolean };

export type TvQuizFormCopy = { lead: string; accent: string; button: string };

type SavedQuizStep = {
  id?: string;
  lead?: string;
  accent?: string;
  multiple?: boolean;
  options?: { id?: string; title?: string; text?: string; accentText?: string }[];
};

type TvDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    plan: CmsDocument["copy"]["plan"] & {
      descriptions?: Record<string, string>;
      offers?: Record<string, Partial<TvOfferCopy>>;
      quiz?: { schemaVersion?: number; steps?: SavedQuizStep[]; form?: Partial<TvQuizFormCopy> };
    };
    additionals: CmsDocument["copy"]["additionals"] & { cards: AdditionalCard[] };
    tvShowcase?: { heading?: string; cards: TvShowcaseCard[] };
    tvGallery: CmsDocument["copy"]["tvGallery"] & { body?: string };
    tvPage: CmsDocument["copy"]["tvPage"] & { steps?: { title: string; text: string }[] };
  };
};

const countIds = ["1", "2", "3", "4plus"] as const;
const offerIds = ["2", "3", "4plus"] as const;



export function isDiscountCard(id: string): id is (typeof offerIds)[number] {
  return (offerIds as readonly string[]).includes(id);
}

function asTv(document: CmsDocument) {
  return document as TvDocument;
}


export function ensureTvMounting(document: CmsDocument): CmsDocument {
  return document;
}

function storedOffer(item: Partial<TvOfferCopy> | undefined): TvOfferCopy {
  return {
    title: item?.title ?? "",
    subtitle: item?.subtitle ?? "",
    button: item?.button ?? "",
    note: item?.note ?? "",
  };
}

export function planOffers(document: CmsDocument) {
  const saved = asTv(document).copy.plan.offers ?? {};
  const offers = {} as Record<(typeof offerIds)[number], TvOfferCopy>;
  for (const id of offerIds) offers[id] = storedOffer(saved[id]);
  return offers;
}

export function planQuiz(document: CmsDocument): TvQuizStep[] {
  const saved = asTv(document).copy.plan.quiz?.steps ?? [];
  return saved.flatMap((step) => {
    if (!step?.id) return [];
    return [{
      id: step.id,
      lead: step.lead ?? "",
      accent: step.accent ?? "",
      multiple: step.multiple === true,
      options: (step.options ?? []).map((option, index) => ({
        id: option.id || `${step.id}-${index}`,
        title: option.title ?? "",
        text: option.text ?? "",
        accentText: option.accentText ?? "",
      })),
    }];
  });
}

export function planQuizForm(document: CmsDocument): TvQuizFormCopy {
  const saved = asTv(document).copy.plan.quiz?.form;
  return {
    lead: saved?.lead ?? "",
    accent: saved?.accent ?? "",
    button: saved?.button ?? "",
  };
}

export function planDescriptions(document: CmsDocument) {
  const saved = asTv(document).copy.plan.descriptions ?? {};
  const notes: Record<string, string> = {};
  for (const id of countIds) notes[id] = saved[id] ?? "";
  return notes;
}

export function additionalSlides(card: CmsDocument["copy"]["additionals"]["cards"][number]) {
  const saved = (card as AdditionalCard).slides?.filter((slide) => slide?.image);
  if (saved && saved.length > 0) {
    return saved.map((slide) => ({
      image: slide.image,
      alt: slide.alt || card.alt || "",
      position: slide.position || card.position || "center",
    }));
  }
  if (!card.image) return [];
  return [{ image: card.image, alt: card.alt || "", position: card.position || "center" }];
}

export function tvShowcaseCards(document: CmsDocument) {
  return (asTv(document).copy.tvShowcase?.cards ?? []).filter((card) => card).map((card) => ({
    title: card.title ?? "",
    text: card.text ?? "",
    image: card.image ?? "",
    alt: card.alt ?? "",
    position: card.position || "center",
  }));
}

export function tvShowcaseHeading(document: CmsDocument) {
  return asTv(document).copy.tvShowcase?.heading ?? "";
}

export function tvSteps(document: CmsDocument) {
  return asTv(document).copy.tvPage.steps ?? [];
}

export function tvPhotoCopy(document: CmsDocument) {
  const gallery = asTv(document).copy.tvGallery;
  return {
    headingLead: gallery.headingLead ?? "",
    headingAccent: gallery.headingAccent ?? "",
    body: gallery.body ?? "",
    book: gallery.book ?? "",
  };
}
