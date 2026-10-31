"use client";

import { PhotoFeature } from "./category-gallery";
import { tvPhotoCopy } from "@/lib/cms/tv-page";
import { useCms } from "@/lib/cms/use-cms";

export function TvGallery() {
  const cms = useCms();
  const copy = tvPhotoCopy(cms);
  const cards = cms.copy.home.works.cards;
  const index = cards.findIndex(
    (card) => card.href.replace(/\/$/, "") === "/services/tv-mounting" || card.icon === "tv",
  );
  const source = index >= 0 ? cards[index] : undefined;
  const photos = (source?.photos ?? []).filter((photo) => photo.image);
  const slides =
    photos.length > 0
      ? photos.map((photo) => ({
          image: photo.image,
          alt: photo.alt || source?.alt || "TV mount",
          position: photo.position || source?.position || "center",
        }))
      : source?.src
        ? [{ image: source.src, alt: source.alt, position: source.position || "center" }]
        : [];

  return (
    <PhotoFeature
      compact
      name={copy.headingLead}
      namePath="copy.tvGallery.headingLead"
      accent={copy.headingAccent}
      accentPath="copy.tvGallery.headingAccent"
      slides={slides}
      galleryPath={index >= 0 ? `slides:copy.home.works.cards.${index}.photos` : "slides:copy.home.works.cards.0.photos"}
      body={copy.body}
      bodyPath="copy.tvGallery.body"
      cta={{ label: copy.book, path: "copy.tvGallery.book", href: "#tv-deals" }}
    />
  );
}
