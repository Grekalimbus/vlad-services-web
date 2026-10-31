"use client";

import { AreasSection } from "@/features/areas";
import { Faq } from "@/features/home";
import { DealsSignup } from "@/features/home/deals-signup";
import { Additionals, Plan, TvBand, TvGallery, TvPhotoMarquee } from "@/features/services";
import { PageFrame } from "@/shared/layout";
import { tvSteps } from "@/lib/cms/tv-page";
import { useCms } from "@/lib/cms/use-cms";
import { ProcessSteps } from "./process-steps";
import { TvShowcase } from "./tv-showcase";

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
        <TvShowcase />
        <ProcessSteps
          steps={tvSteps(cms)}
          serviceName={page.title || "TV Mounting"}
          pathFor={(index, field) => `copy.tvPage.steps.${index}.${field}`}
        />
        <TvGallery />
        <Faq />
        <AreasSection id="areas" />
        <DealsSignup id="tv-deals" />
      </TvBand>
    </PageFrame>
  );
}
