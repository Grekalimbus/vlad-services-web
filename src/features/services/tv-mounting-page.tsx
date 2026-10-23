"use client";

import { Additionals, Plan, TvBand, TvGallery, TvPhotoMarquee } from "@/features/services";
import { ServiceIntro } from "./service-intro";
import { PageFrame } from "@/shared/layout";
import { useCms } from "@/lib/cms/use-cms";

export function TvMountingPage() {
  const cms = useCms();
  const page = cms.copy.tvPage;
  const categoryIndex = cms.serviceCategories.findIndex((item) => item.id === "tv-mounting");
  const category = categoryIndex >= 0 ? cms.serviceCategories[categoryIndex] : undefined;
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
          <TvPhotoMarquee photos={reel} heading={false} />
        </div>
      }
    >
      <ServiceIntro
        slug="tv-mounting"
        name={category?.name ?? page.title}
        namePath={categoryIndex >= 0 ? `serviceCategories.${categoryIndex}.name` : "copy.tvPage.title"}
        summary={category?.summary}
        summaryPath={categoryIndex >= 0 ? `serviceCategories.${categoryIndex}.summary` : undefined}
      />
      <Plan />
      <TvBand>
        <Additionals />
        <TvGallery />
      </TvBand>
    </PageFrame>
  );
}
