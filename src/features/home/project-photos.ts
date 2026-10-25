import { getPath } from "@/lib/cms/read";

export type ReelPhoto = { image: string; alt: string };

type GalleryEntry = { src?: string; alt?: string; title?: string };

type ReelSource = {
  galleryItems: GalleryEntry[];
};

function photosFrom(value: unknown): ReelPhoto[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as { image?: unknown; src?: unknown; alt?: unknown };
    const image = String(record.image ?? record.src ?? "");
    if (!image) return [];
    return [{ image, alt: String(record.alt ?? "Project photo") }];
  });
}

function galleryPhotos(document: ReelSource): ReelPhoto[] {
  return document.galleryItems.flatMap((entry) =>
    entry.src ? [{ image: entry.src, alt: entry.alt || entry.title || "Project photo" }] : [],
  );
}

/** Homepage project rows. Saved rows win; otherwise the current gallery is split between them. */
export function projectReels(document: ReelSource): { top: ReelPhoto[]; bottom: ReelPhoto[] } {
  const stored = getPath(document, "copy.home.works.reels");
  if (stored && typeof stored === "object") {
    const record = stored as { top?: unknown; bottom?: unknown };
    return { top: photosFrom(record.top), bottom: photosFrom(record.bottom) };
  }
  const photos = galleryPhotos(document);
  return {
    top: photos.filter((_, index) => index % 2 === 0),
    bottom: photos.filter((_, index) => index % 2 === 1),
  };
}
