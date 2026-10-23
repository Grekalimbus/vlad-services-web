import { LegalPageView } from "@/features/legal";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";
import { metadataFor } from "@/lib/seo-metadata";
import { JsonLd } from "@/shared/seo";

export function generateMetadata() {
  return metadataFor("/privacy-policy");
}

export default async function PrivacyPolicyPage() {
  const cms = await bindCms();
  return (
    <CmsPage>
      <JsonLd data={pageMeta("/privacy-policy", cms).jsonLd} />
      <LegalPageView slug="privacy-policy" />
    </CmsPage>
  );
}
