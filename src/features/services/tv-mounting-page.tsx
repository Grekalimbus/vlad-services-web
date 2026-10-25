"use client";

import { Additionals, Plan, TvBand, TvGallery, TvPhotoMarquee } from "@/features/services";
import { PageFrame } from "@/shared/layout";
import { useCms } from "@/lib/cms/use-cms";

export function TvMountingPage() {
  const cms = useCms();
  const page = cms.copy.tvPage;
  const reel = cms.galleryItems.flatMap((entry) =>
    entry.categoryId === "tv-mounting" && entry.src ? [{ id: entry.id, src: entry.src, alt: entry.alt }] : [],
  );

  return (
    <PageFrame
      flush
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      hero={
        <div data-cms-gallery="photos:tv-mounting" data-empty={reel.length === 0 ? "" : undefined}>
          <TvPhotoMarquee photos={reel} />
        </div>
      }
    >
      <Plan />
      <TvBand>
        <Additionals />
        <TvGallery />
      </TvBand>
    </PageFrame>
  );
}
