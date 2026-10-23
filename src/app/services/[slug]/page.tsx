import { notFound } from "next/navigation";
import { CategoryLanding } from "@/features/services";
import { TvMountingPage } from "@/features/services/tv-mounting-page";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";
import { metadataFor } from "@/lib/seo-metadata";
import { landingForSlug, serviceRouteSlugs } from "@/lib/services";
import { JsonLd } from "@/shared/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceRouteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return metadataFor(`/services/${slug}`);
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cms = await bindCms();
  const landing = landingForSlug(slug);
  if (!landing) notFound();
  const data = <JsonLd data={pageMeta(`/services/${landing.slug}`, cms).jsonLd} />;

  if (landing.id === "tv-mounting") {
    return (
      <CmsPage>
        {data}
        <TvMountingPage />
      </CmsPage>
    );
  }
  if (landing.id === "electrical" || landing.id === "handyman") {
    return (
      <CmsPage>
        {data}
        <CategoryLanding category={landing} />
      </CmsPage>
    );
  }

  notFound();
}

