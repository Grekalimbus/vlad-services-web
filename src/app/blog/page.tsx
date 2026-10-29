import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { metadataFor } from "@/lib/seo-metadata";
import { pageMeta } from "@/lib/seo";
import { JsonLd } from "@/shared/seo";
import { BlogPageView } from "@/features/home/blog-page";

export function generateMetadata() {
  return metadataFor("/blog");
}

export default async function BlogPage() {
  const cms = await bindCms();
  return (
    <CmsPage>
      <JsonLd data={pageMeta("/blog", cms).jsonLd} />
      <BlogPageView />
    </CmsPage>
  );
}
