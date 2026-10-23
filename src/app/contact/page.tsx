import { RedirectHash } from "@/shared/layout/redirect-hash";
import { metadataFor } from "@/lib/seo-metadata";

export function generateMetadata() {
  return metadataFor("/contact");
}

export default function ContactPage() {
  return <RedirectHash hash="footer" label="Contact" />;
}
