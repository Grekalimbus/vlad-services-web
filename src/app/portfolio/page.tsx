import { PageFrame } from "@/shared/layout";
import { PortfolioBrowser } from "@/features/gallery";
import { CmsPage } from "@/lib/cms/cms-page";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";
import { metadataFor } from "@/lib/seo-metadata";
import { JsonLd } from "@/shared/seo";
import styles from "@/styles/shared.module.css";

export function generateMetadata() {
  return metadataFor("/portfolio");
}

export default async function PortfolioPage() {
  const cms = await bindCms();
  const copy = cms.copy.portfolio;
  return (
    <CmsPage>
    <PageFrame
      eyebrow={copy.eyebrow}
      title={copy.title}
      titlePath="copy.portfolio.title"
      description={copy.description}
      descriptionPath="copy.portfolio.description"
      crumbs={[{ href: "/", label: "Home" }, { label: copy.title, labelPath: "copy.portfolio.title" }]}
    >
      <JsonLd data={pageMeta("/portfolio", cms).jsonLd} />
      <div className={styles.pageContent}>
        <PortfolioBrowser />
      </div>
    </PageFrame>
    </CmsPage>
  );
}
