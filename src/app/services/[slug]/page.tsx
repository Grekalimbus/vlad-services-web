import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Additionals, CategoryLanding, Plan, TvBand, TvGallery, TvPhotoMarquee } from "@/features/services";
import { PageFrame } from "@/shared/layout";
import { itemsInCategory } from "@/lib/gallery";
import { landingForSlug, serviceRouteSlugs } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceRouteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const landing = landingForSlug(slug);
  if (!landing) return {};
  return {
    title: landing.name,
    description: `${landing.summary} ${site.legalName} in ${site.areaServed}.`,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landing = landingForSlug(slug);
  if (!landing) notFound();

  if (landing.id === "tv-mounting") return <TvMountingPage />;
  if (landing.id === "electrical" || landing.id === "handyman") {
    return <CategoryLanding category={landing} />;
  }

  notFound();
}

function TvMountingPage() {
  const photos = itemsInCategory("tv-mounting");
  const reel = photos.flatMap((entry) =>
    entry.src ? [{ id: entry.id, src: entry.src, alt: entry.alt }] : [],
  );
  return (
    <PageFrame
      flush
      eyebrow="TV Mounting"
      title="TV Mounting"
      description="Choose how many televisions you need mounted, pick a size, and tell us the wall. Concealment, a TV outlet, and all four mount types live on this page."
      hero={<TvPhotoMarquee photos={reel} />}
    >
      <Plan />
      <TvBand>
        <Additionals />
        <TvGallery />
      </TvBand>
    </PageFrame>
  );
}

