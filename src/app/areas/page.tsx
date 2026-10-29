import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { metadataFor } from "@/lib/seo-metadata";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/shared/seo";
import { AreasPageView } from "@/features/home/areas-page";

export function generateMetadata() {
  return metadataFor("/areas");
}

export default async function AreasPage() {
  const cms = await bindCms();
  return (
    <CmsPage>
      <JsonLd data={pageMeta("/areas", cms).jsonLd} />
      <AreasPageView />
    </CmsPage>
  );
}
