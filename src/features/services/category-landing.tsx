"use client";

import { TvBand } from "./tv-band";
import { TvPhotoMarquee } from "./tv-photo-marquee";
import { OfferGrid, PhotoFeature } from "./category-gallery";
import { ElectricianLanding } from "./electrician-landing";
import { PageFrame } from "@/shared/layout";
import { useCms } from "@/lib/cms/use-cms";
import type { ServiceCategory } from "@/lib/services";
import styles from "./category-landing.module.css";

export function CategoryLanding({ category }: { category: ServiceCategory }) {
  const cms = useCms();
  const fresh = cms.serviceCategories.find((item) => item.id === category.id || item.slug === category.slug) ?? category;
  const index = cms.serviceCategories.findIndex((item) => item.id === fresh.id);
  const photos = cms.galleryItems.flatMap((entry) =>
    entry.categoryId === fresh.id && entry.src
      ? [{ image: entry.src, alt: entry.alt, title: entry.title }]
      : [],
  );
  const worksIndex = fresh.id === "electrical" ? electricalWorksCard(cms.copy.home.works.cards) : -1;
  const worksPhotos = worksIndex >= 0 ? cms.copy.home.works.cards[worksIndex].photos.filter((photo) => photo.image) : [];
  const reel = (worksPhotos.length > 0 ? worksPhotos : photos).map((photo, photoIndex) => ({
    id: `${fresh.id}-${photoIndex}`,
    src: photo.image,
    alt: photo.alt,
  }));
  const gallery = worksPhotos.length > 0 ? `slides:copy.home.works.cards.${worksIndex}.photos` : `photos:${fresh.id}`;

  return (
    <PageFrame
      flush
      light
      eyebrow={fresh.name}
      title={fresh.name}
      description={fresh.summary}
      hero={
        <div data-cms-gallery={gallery} data-empty={reel.length === 0 ? "" : undefined}>
          <TvPhotoMarquee photos={reel} label={fresh.name} roomy />
        </div>
      }
    >
      <TvBand blend>
        <div className={styles.band}>
          {fresh.id === "electrical" ? (
            <ElectricianLanding category={fresh} />
          ) : (
            <>
              <h1 className={styles.pageTitle} data-cms={index >= 0 ? `serviceCategories.${index}.name` : undefined}>
                {fresh.name}
              </h1>
              <OfferGrid categoryId={fresh.id} />
              <PhotoFeature
                name={fresh.name}
                namePath={index >= 0 ? `serviceCategories.${index}.name` : undefined}
                slides={photos}
                galleryPath={`items:${fresh.id}`}
              />
            </>
          )}
        </div>
      </TvBand>
    </PageFrame>
  );
}

function electricalWorksCard(cards: { href: string; title: string; icon: string }[]) {
  const byHref = cards.findIndex((card) => card.href.replace(/\/$/, "") === "/services/electrical");
  if (byHref >= 0) return byHref;
  return cards.findIndex((card) => card.icon === "zap" || /^electrical$/i.test(card.title.trim()));
}
