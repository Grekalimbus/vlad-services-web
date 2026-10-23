import { CmsPage } from "@/lib/cms/cms-page";
import { metadataFor } from "@/lib/seo-metadata";
import { NotFoundPage } from "./not-found-page";

export function generateMetadata() {
  return metadataFor("/404");
}

export default function NotFound() {
  return (
    <CmsPage>
      <NotFoundPage />
    </CmsPage>
  );
}
