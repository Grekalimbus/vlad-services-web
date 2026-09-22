import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFrame } from "@/shared/layout";
import { PortfolioBrowser } from "@/features/gallery";
import { galleryCategories, getGalleryCategory } from "@/lib/gallery";
import { site } from "@/lib/site";
import styles from "@/styles/shared.module.css";

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
      <div className={styles.pageContent}>
        <PortfolioBrowser initialCategory={item} />
      </div>
    </PageFrame>
  );
}
