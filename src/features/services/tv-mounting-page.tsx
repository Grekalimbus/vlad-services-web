"use client";

import { AreasSection } from "@/features/areas";
import { Faq } from "@/features/home";
import { DealsSignup } from "@/features/home/deals-signup";
import { Additionals, Plan, TvBand, TvPhotoMarquee } from "@/features/services";
import { PageFrame } from "@/shared/layout";
import { tvSteps } from "@/lib/cms/tv-page";
import { useCms } from "@/lib/cms/use-cms";
import { ProcessSteps } from "./process-steps";
import { TvShowcase } from "./tv-showcase";

export function TvMountingPage() {
  const cms = useCms();
  const page = cms.copy.tvPage;
  const cards = cms.copy.home.works.cards;
  const cardIndex = cards.findIndex(
    (card) => card.href.replace(/\/$/, "") === "/services/tv-mounting" || card.icon === "tv",
  );
  const cardPhotos = cardIndex >= 0 ? cards[cardIndex].photos.filter((photo) => photo.image) : [];
  const galleryPhotos = cms.galleryItems.flatMap((entry) =>
    entry.categoryId === "tv-mounting" && entry.src ? [{ id: entry.id, src: entry.src, alt: entry.alt }] : [],
  );
  const reel =
    cardPhotos.length > 0
      ? cardPhotos.map((photo, index) => ({
          id: `tv-${index}`,
          src: photo.image,
          alt: photo.alt || "",
        }))
      : galleryPhotos;
  const gallery =
    cardPhotos.length > 0 ? `slides:copy.home.works.cards.${cardIndex}.photos` : "photos:tv-mounting";

  return (
    <PageFrame
      flush
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      hero={
        <div data-cms-gallery={gallery} data-empty={reel.length === 0 ? "" : undefined}>
          <TvPhotoMarquee photos={reel} seamless />
        </div>
      }
    >
      <Plan />
      <TvBand>
        <TvShowcase />
        <Additionals />
        <ProcessSteps
          steps={tvSteps(cms)}
          tightTop
          pathFor={(index, field) => `copy.tvPage.steps.${index}.${field}`}
        />
        <Faq />
        <AreasSection id="areas" />
        <DealsSignup id="tv-deals" />
      </TvBand>
    </PageFrame>
  );
}
