import { CmsPage } from "@/lib/cms/cms-page";
import { RedirectHash } from "@/shared/layout/redirect-hash";
import { metadataFor } from "@/lib/seo-metadata";

export function generateMetadata() {
  return metadataFor("/contact");
}

export default function ContactPage() {
  return (
    <CmsPage path="/">
      <RedirectHash hash="footer" label="Contact" />
    </CmsPage>
  );
}
