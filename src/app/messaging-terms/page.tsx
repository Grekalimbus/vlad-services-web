import { LegalPageView } from "@/features/legal";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";
import { metadataFor } from "@/lib/seo-metadata";
import { JsonLd } from "@/shared/seo";

export function generateMetadata() {
  return metadataFor("/messaging-terms");
}

export default async function MessagingTermsPage() {
  const cms = await bindCms();
  return (
    <CmsPage>
      <JsonLd data={pageMeta("/messaging-terms", cms).jsonLd} />
      <LegalPageView slug="messaging-terms" />
    </CmsPage>
  );
}
