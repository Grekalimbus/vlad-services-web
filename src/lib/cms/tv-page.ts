import type { CmsDocument } from "./types";
import { electricalLanding } from "./electrical-landing";

export type TvSlide = { image: string; alt: string; position: string };

export type TvShowcaseCard = { title: string; image: string; alt: string; position: string };

type AdditionalCard = CmsDocument["copy"]["additionals"]["cards"][number] & { slides?: TvSlide[] };

export type TvOfferCopy = {
  title: string;
  subtitle: string;
  button: string;
  note: string;
};

export type TvQuizOption = { id: string; title: string; text: string };

export type TvQuizStep = { id: string; lead: string; accent: string; options: TvQuizOption[] };

export type TvQuizFormCopy = { lead: string; accent: string; button: string };

type SavedQuizStep = { lead?: string; accent?: string; options?: { title?: string; text?: string }[] };

type TvDocument = CmsDocument & {
  copy: CmsDocument["copy"] & {
    plan: CmsDocument["copy"]["plan"] & {
      descriptions?: Record<string, string>;
      offers?: Record<string, Partial<TvOfferCopy>>;
      quiz?: { steps?: SavedQuizStep[]; form?: Partial<TvQuizFormCopy> };
    };
    additionals: CmsDocument["copy"]["additionals"] & { cards: AdditionalCard[] };
    tvShowcase?: { cards: TvShowcaseCard[] };
    tvGallery: CmsDocument["copy"]["tvGallery"] & { body?: string };
    tvPage: CmsDocument["copy"]["tvPage"] & { steps?: { title: string; text: string }[] };
  };
};

const defaultDescriptions: Record<string, string> = {
  "1": "One television on a single wall.",
  "2": "Two rooms, mounted in one visit.",
  "3": "Three screens in one coordinated visit.",
  "4plus": "Four or more across the house.",
};

const extraSlides: TvSlide[][] = [
  [
    { image: "/works/tv-office-wall.jpg", alt: "Television mounted with the cable hidden at the wall", position: "center 32%" },
    { image: "/works/gallery-wall.jpg", alt: "Wall-mounted television with a clean cable line", position: "18% 42%" },
  ],
  [
    { image: "/works/tv-living-cream.jpg", alt: "Soundbar mounted under a living room television", position: "68% 42%" },
    { image: "/works/hero.jpg", alt: "Television and soundbar above a fireplace", position: "center 42%" },
  ],
  [
    { image: "/works/pexels-tv-black.jpg", alt: "Devices kept beside a mounted television", position: "center 45%" },
    { image: "/works/tv-pexels.jpg", alt: "Television mounted for a group viewing setup", position: "center 40%" },
  ],
  [
    { image: "/works/tv-wood-wall.jpg", alt: "Television mounted on a wood wall", position: "72% 18%" },
    { image: "/works/pexels-bedroom-tv.jpg", alt: "Television mounted in a bedroom", position: "center 48%" },
  ],
];

const defaultShowcase: TvShowcaseCard[] = [
  { title: "Fireplace", image: "/works/hero.jpg", alt: "Television mounted above a fireplace", position: "center 40%" },
  { title: "Living Room", image: "/works/tv-living-blue.jpg", alt: "Television mounted in a living room", position: "center 42%" },
  { title: "Bedroom", image: "/works/pexels-bedroom-tv.jpg", alt: "Television mounted in a bedroom", position: "center 48%" },
  { title: "Office", image: "/works/tv-office-wall.jpg", alt: "Television mounted on an office wall", position: "center 32%" },
];

const defaultGalleryBody =
  "These photos are finished TV mounts in homes around San Diego and the nearby cities. Screens sit level over fireplaces, on wood walls, and in living rooms where the soundbar lines up with the set. Cables disappear into the wall or a paintable concealer. Each picture is the end of one visit: the mount is in a stud, the television is centered, and the picture was checked before the tools were packed.\n\nMost of this work takes about an hour when the television is already in the room. We bring a standard mount, cover the floor, and do not leave hardware or packing behind. If the wall is brick, the box is loose, or a wire needs a new outlet, we stop and say so before any extra work begins. The price set on the call is the price for the job in the photo. Looking through the set is the quickest way to judge the finish you can expect in your own room.";

const countIds = ["1", "2", "3", "4plus"] as const;
const offerIds = ["2", "3", "4plus"] as const;

const defaultOffers: Record<(typeof offerIds)[number], TvOfferCopy> = {
  "2": {
    title: "2 TVs — Save 20% Today!",
    subtitle: "Get your 20% discount now!",
    button: "Claim My 20% Discount",
    note: "We'll call you within 20 minutes to confirm.",
  },
  "3": {
    title: "3 TVs — Save 25% Today!",
    subtitle: "Get your 25% discount now!",
    button: "Claim My 25% Discount",
    note: "We'll call you within 20 minutes to confirm.",
  },
  "4plus": {
    title: "4+ TVs — Save 30% Today!",
    subtitle: "Get your 30% discount now!",
    button: "Claim My 30% Discount",
    note: "We'll call you within 20 minutes to confirm.",
  },
};

const defaultQuiz: TvQuizStep[] = [
  {
    id: "room",
    lead: "Where will",
    accent: "the TV go?",
    options: [
      { id: "living", title: "Living room", text: "The main family wall." },
      { id: "bedroom", title: "Bedroom", text: "Across from the bed." },
      { id: "fireplace", title: "Fireplace", text: "Above the mantel." },
      { id: "other", title: "Another room", text: "Office, kitchen, or garage." },
    ],
  },
  {
    id: "mount",
    lead: "Which mount",
    accent: "do you need?",
    options: [
      { id: "fixed", title: "Fixed mount", text: "Sits flush on the wall." },
      { id: "tilt", title: "Tilting mount", text: "Tilts down toward you." },
      { id: "motion", title: "Full-motion", text: "Pulls out and swivels." },
      { id: "ceiling", title: "Ceiling mount", text: "Hangs from the ceiling." },
    ],
  },
  {
    id: "wall",
    lead: "What kind of",
    accent: "wall is it?",
    options: [
      { id: "drywall", title: "Drywall", text: "Painted wall, wood studs." },
      { id: "masonry", title: "Brick or stone", text: "Needs masonry anchors." },
      { id: "wood", title: "Wood panel", text: "Wood panel or feature." },
      { id: "unsure", title: "Not sure", text: "Checked on the visit." },
    ],
  },
  {
    id: "size",
    lead: "What size",
    accent: "is the TV?",
    options: [
      { id: "43", title: '43" or smaller', text: "Compact bedroom or office." },
      { id: "55", title: '50–55"', text: "Fits most living rooms." },
      { id: "65", title: '65"', text: "Our most common size." },
      { id: "75", title: '75"', text: "Needs a stronger mount." },
      { id: "85", title: '85" or larger', text: "We confirm the wall." },
      { id: "unsure", title: "Not sure yet", text: "Size checked on site." },
    ],
  },
];

const defaultQuizForm: TvQuizFormCopy = {
  lead: "Get your",
  accent: "$30 quote",
  button: "Get my Quote & $30",
};

export function isDiscountCard(id: string): id is (typeof offerIds)[number] {
  return (offerIds as readonly string[]).includes(id);
}

function asTv(document: CmsDocument) {
  return document as TvDocument;
}

function seededSlides(card: AdditionalCard, index: number): TvSlide[] {
  const first = { image: card.image, alt: card.alt, position: card.position || "center" };
  const extras = (extraSlides[index] ?? []).filter((slide) => slide.image && slide.image !== first.image);
  return [first, ...extras].filter((slide) => slide.image);
}

function isOldBook(book: string | undefined) {
  const value = book?.trim() ?? "";
  return value === "" || /^book now$/i.test(value) || /^get a quote$/i.test(value);
}

function isOldHeading(gallery: { headingLead?: string; headingAccent?: string }) {
  return gallery.headingLead === "TVs" && gallery.headingAccent === "Gallery";
}

function tvReady(document: CmsDocument) {
  const copy = asTv(document).copy;
  const descriptions = copy.plan.descriptions;
  const notesReady = Boolean(descriptions && countIds.every((id) => descriptions[id]?.trim()));
  const slidesReady = (copy.additionals.cards as AdditionalCard[]).every(
    (card) => Array.isArray(card.slides) && card.slides.some((slide) => slide.image),
  );
  const showcaseReady = (copy.tvShowcase?.cards.length ?? 0) >= 4;
  const gallery = copy.tvGallery;
  const galleryReady = Boolean(gallery.body?.trim()) && !isOldBook(gallery.book) && !isOldHeading(gallery);
  const stepsReady = (copy.tvPage.steps?.length ?? 0) >= 4;
  const offers = copy.plan.offers;
  const offersReady = Boolean(
    offers &&
      offerIds.every((id) => {
        const offer = offers[id];
        return Boolean(offer?.title?.trim() && offer.subtitle?.trim() && offer.button?.trim() && offer.note?.trim());
      }),
  );
  const quiz = copy.plan.quiz;
  const quizReady = Boolean(
    quiz?.form?.lead?.trim() &&
      quiz.form.accent?.trim() &&
      quiz.form.button?.trim() &&
      defaultQuiz.every((step, index) => {
        const saved = quiz.steps?.[index];
        return Boolean(
          saved?.lead?.trim() && saved.accent?.trim() && (saved.options?.length ?? 0) >= step.options.length,
        );
      }),
  );
  return notesReady && slidesReady && showcaseReady && galleryReady && stepsReady && offersReady && quizReady;
}

export function ensureTvMounting(document: CmsDocument): CmsDocument {
  if (!document?.copy?.additionals?.cards || !document.copy.plan || !document.copy.tvGallery || !document.copy.tvPage) {
    return document;
  }
  if (tvReady(document)) return document;

  const next = structuredClone(document) as TvDocument;
  const descriptions = { ...defaultDescriptions, ...next.copy.plan.descriptions };
  for (const id of countIds) {
    if (!descriptions[id]?.trim()) descriptions[id] = defaultDescriptions[id];
  }
  next.copy.plan.descriptions = descriptions;

  (next.copy.additionals.cards as AdditionalCard[]).forEach((card, index) => {
    const slides = card.slides?.filter((slide) => slide?.image);
    if (!slides || slides.length === 0) card.slides = seededSlides(card, index);
  });

  if (!next.copy.tvShowcase?.cards || next.copy.tvShowcase.cards.length < 4) {
    next.copy.tvShowcase = { cards: defaultShowcase.map((card) => ({ ...card })) };
  }

  const gallery = next.copy.tvGallery;
  if (!gallery.body?.trim()) gallery.body = defaultGalleryBody;
  if (isOldBook(gallery.book)) gallery.book = "CHECK DEALS";
  if (isOldHeading(gallery)) {
    gallery.headingLead = "TV";
    gallery.headingAccent = "photos";
  }

  if (!next.copy.tvPage.steps || next.copy.tvPage.steps.length < 4) {
    next.copy.tvPage.steps = electricalLanding.steps.map((step) => ({ title: step.title, text: step.text }));
  }

  const offers = { ...next.copy.plan.offers };
  for (const id of offerIds) {
    const current = offers[id];
    const fallback = defaultOffers[id];
    offers[id] = {
      title: current?.title?.trim() ? current.title : fallback.title,
      subtitle: current?.subtitle?.trim() ? current.subtitle : fallback.subtitle,
      button: current?.button?.trim() ? current.button : fallback.button,
      note: current?.note?.trim() ? current.note : fallback.note,
    };
  }
  next.copy.plan.offers = offers;
  next.copy.plan.quiz = {
    steps: planQuiz(next),
    form: planQuizForm(next),
  };

  return next;
}

export function planOffers(document: CmsDocument) {
  const saved = asTv(document).copy.plan.offers ?? {};
  const offers = {} as Record<(typeof offerIds)[number], TvOfferCopy>;
  for (const id of offerIds) {
    const item = saved[id];
    const fallback = defaultOffers[id];
    offers[id] = {
      title: item?.title?.trim() ? item.title : fallback.title,
      subtitle: item?.subtitle?.trim() ? item.subtitle : fallback.subtitle,
      button: item?.button?.trim() ? item.button : fallback.button,
      note: item?.note?.trim() ? item.note : fallback.note,
    };
  }
  return offers;
}

export function planQuiz(document: CmsDocument): TvQuizStep[] {
  const saved = asTv(document).copy.plan.quiz?.steps ?? [];
  return defaultQuiz.map((step, index) => {
    const current = saved[index];
    return {
      id: step.id,
      lead: current?.lead?.trim() || step.lead,
      accent: current?.accent?.trim() || step.accent,
      options: step.options.map((option, optionIndex) => {
        const savedOption = current?.options?.[optionIndex];
        return {
          id: option.id,
          title: savedOption?.title?.trim() || option.title,
          text: savedOption?.text?.trim() || option.text,
        };
      }),
    };
  });
}

export function planQuizForm(document: CmsDocument): TvQuizFormCopy {
  const saved = asTv(document).copy.plan.quiz?.form;
  return {
    lead: saved?.lead?.trim() || defaultQuizForm.lead,
    accent: saved?.accent?.trim() || defaultQuizForm.accent,
    button: saved?.button?.trim() || defaultQuizForm.button,
  };
}

export function planDescriptions(document: CmsDocument) {
  const saved = asTv(document).copy.plan.descriptions;
  const notes = { ...defaultDescriptions, ...saved };
  for (const id of countIds) {
    if (!notes[id]?.trim()) notes[id] = defaultDescriptions[id];
  }
  return notes;
}

export function additionalSlides(card: CmsDocument["copy"]["additionals"]["cards"][number], index: number) {
  const saved = (card as AdditionalCard).slides?.filter((slide) => slide?.image);
  if (saved && saved.length > 0) {
    return saved.map((slide) => ({
      image: slide.image,
      alt: slide.alt || card.alt,
      position: slide.position || card.position || "center",
    }));
  }
  return seededSlides(card, index);
}

export function tvShowcaseCards(document: CmsDocument) {
  const cards = asTv(document).copy.tvShowcase?.cards?.filter((card) => card);
  if (cards && cards.length >= 4) return cards;
  return defaultShowcase;
}

export function tvSteps(document: CmsDocument) {
  const steps = asTv(document).copy.tvPage.steps;
  if (steps && steps.length >= 4) return steps;
  return electricalLanding.steps.map((step) => ({ title: step.title, text: step.text }));
}

export function tvPhotoCopy(document: CmsDocument) {
  const gallery = asTv(document).copy.tvGallery;
  const oldHeading = isOldHeading(gallery);
  return {
    headingLead: oldHeading ? "TV" : gallery.headingLead,
    headingAccent: oldHeading ? "photos" : gallery.headingAccent,
    body: gallery.body?.trim() ? gallery.body : defaultGalleryBody,
    book: isOldBook(gallery.book) ? "CHECK DEALS" : gallery.book,
  };
}
