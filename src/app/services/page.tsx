import { RedirectHash } from "@/shared/layout/redirect-hash";
import { metadataFor } from "@/lib/seo-metadata";

export function generateMetadata() {
  return metadataFor("/services");
}

export default function ServicesPage() {
  return <RedirectHash hash="services" label="Services" />;
}
