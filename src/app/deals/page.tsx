import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { metadataFor } from "@/lib/seo-metadata";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/shared/seo";
import { DealsPageView } from "@/features/home/deals-page";

export function generateMetadata() {
  return metadataFor("/deals");
}

export default async function DealsPage() {
  const cms = await bindCms();
  return (
    <CmsPage path="/deals">
      <JsonLd data={pageMeta("/deals", cms).jsonLd} />
      <DealsPageView />
    </CmsPage>
  );
}
