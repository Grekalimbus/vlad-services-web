import type { ReactNode } from "react";
import { Header, Providers } from "@/shared/layout";
import { CmsBoundary } from "./boundary";
import { bindCms } from "./load";
import styles from "@/app/layout.module.css";

/** Public page chrome. The HTML and the client document are the same CMS read. */
export async function CmsPage({ children }: { path?: string; children: ReactNode }) {
  const cms = await bindCms();
  const payload = JSON.stringify(cms).replaceAll("<", "\\u003c").replaceAll("&", "\\u0026");

  return (
    <>
      <script id="cms-data" dangerouslySetInnerHTML={{ __html: `window.__CMS__=${payload}` }} />
      <a href="#content" className={styles.skipLink}>
        Skip to content
      </a>
      <CmsBoundary payload={payload}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </CmsBoundary>
    </>
  );
}
