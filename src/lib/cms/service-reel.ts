import type { CmsDocument } from "./types";

export type ReelPhoto = {
  id: string;
  src: string;
  alt: string;
};

/**
 * Same photo source the service pages use for their top carousel:
 * the matching Works card photos, otherwise that category's gallery.
 */
export function serviceReel(document: CmsDocument, slug: string): ReelPhoto[] {
  const category = document.serviceCategories.find((item) => item.slug === slug || item.id === slug);
  const categoryId = slug === "tv-mounting" ? "tv-mounting" : (category?.id ?? slug);
  const cards = document.copy.home.works.cards;
  const cardIndex = worksCardIndex(cards, slug);
  const cardPhotos = cardIndex >= 0 ? cards[cardIndex].photos.filter((photo) => photo.image) : [];
  if (cardPhotos.length > 0) {
    return cardPhotos.map((photo, index) => ({
      id: `${categoryId}-${index}`,
      src: photo.image,
      alt: photo.alt || "",
    }));
  }
  return document.galleryItems.flatMap((entry) =>
    entry.categoryId === categoryId && entry.src
      ? [{ id: entry.id, src: entry.src, alt: entry.alt || "" }]
      : [],
  );
}

function worksCardIndex(cards: { href: string; title: string; icon: string }[], slug: string) {
  if (slug === "tv-mounting") {
    return cards.findIndex(
      (card) => card.href.replace(/\/$/, "") === "/services/tv-mounting" || card.icon === "tv",
    );
  }
  const href = `/services/${slug}`.replace(/\/$/, "");
  const byHref = cards.findIndex((card) => card.href.replace(/\/$/, "") === href);
  if (byHref >= 0) return byHref;
  if (slug === "electrical") {
    return cards.findIndex((card) => card.icon === "zap" || /^electrical$/i.test(card.title.trim()));
  }
  return -1;
}
