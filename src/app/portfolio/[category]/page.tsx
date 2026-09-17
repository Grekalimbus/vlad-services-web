import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/components/page-frame";
import { PortfolioBrowser } from "@/components/portfolio-browser";
import { galleryCategories, getGalleryCategory } from "@/lib/gallery";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return galleryCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const item = getGalleryCategory(category);
  if (!item) return {};
  return {
    title: `${item.name} projects`,
    description: `${item.summary} Gallery for ${site.legalName}.`,
  };
}

export default async function PortfolioCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const item = getGalleryCategory(category);
  if (!item) notFound();

  return (
    <PageFrame eyebrow="Projects" title={item.name} description={item.summary}>
      <div className="container-page py-16 md:py-24">
        <PortfolioBrowser initialCategory={item} />
      </div>
    </PageFrame>
  );
}
