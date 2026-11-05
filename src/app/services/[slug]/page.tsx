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
  const data = <JsonLd data={pageMeta(`/services/${slug}`, cms).jsonLd} />;

  const path = `/services/${slug}`;

  if (landing.id === "tv-mounting") {
    const { PlanFontScope } = await import("@/features/services/plan-font-scope");
    return (
      <CmsPage path={path}>
        {data}
        <PlanFontScope>
          <TvMountingPage />
        </PlanFontScope>
      </CmsPage>
    );
  }

  return (
    <CmsPage path={path}>
      {data}
      <CategoryLanding category={landing} />
    </CmsPage>
  );
}

