import { notFound, redirect } from "next/navigation";
import { CategoryLanding } from "@/features/services";
import { TvMountingPage } from "@/features/services/tv-mounting-page";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { pageMeta, redirectTarget } from "@/lib/seo";
import { metadataFor } from "@/lib/seo-metadata";
import { landingForSlug } from "@/lib/services";
import { JsonLd } from "@/shared/seo";

export const dynamic = "force-dynamic";

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
  const destination = redirectTarget(`/services/${slug}`, cms);
  if (destination) redirect(destination);
  const landing = landingForSlug(slug, cms);
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

