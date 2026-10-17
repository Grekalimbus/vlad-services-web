import { TvBand } from "./tv-band";
import { TvPhotoMarquee } from "./tv-photo-marquee";
import { OfferGrid, PhotoFeature } from "./category-gallery";
import { PageFrame } from "@/shared/layout";
import { itemsInCategory } from "@/lib/gallery";
import type { ServiceCategory } from "@/lib/services";
import styles from "./category-landing.module.css";

export function CategoryLanding({ category }: { category: ServiceCategory }) {
  const photos = itemsInCategory(category.id).flatMap((entry) =>
    entry.src
      ? [{ image: entry.src, alt: entry.alt, title: entry.title }]
      : [],
  );
  const reel = photos.map((photo, index) => ({
    id: `${category.id}-${index}`,
    src: photo.image,
    alt: photo.alt,
  }));

  return (
    <PageFrame
      flush
      light
      eyebrow={category.name}
      title={category.name}
      description={category.summary}
      hero={<TvPhotoMarquee photos={reel} label={category.name} roomy />}
    >
      <TvBand blend>
        <div className={styles.band}>
          <h1 className={styles.pageTitle}>{category.name}</h1>
          <OfferGrid categoryId={category.id} />
          <PhotoFeature name={category.name} slides={photos} />
        </div>
      </TvBand>
    </PageFrame>
  );
}
