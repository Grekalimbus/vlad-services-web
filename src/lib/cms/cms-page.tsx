import type { ReactNode } from "react";
import { Header, Providers } from "@/shared/layout";
import { CmsBoundary } from "./boundary";
import { bindCms } from "./load";
import { toPublicCms } from "./public-projection";
import { rememberPublicCms } from "./store";
import styles from "@/app/layout.module.css";

/**
 * Public page chrome: path-aware CMS projection + header providers.
 * Uses an explicit path so static export (Cloudflare Pages) stays prerenderable
 * without reading request headers in the root layout.
 */
export async function CmsPage({ path, children }: { path: string; children: ReactNode }) {
  const cms = await bindCms();
  const publicCms = toPublicCms(cms, path);
  rememberPublicCms(publicCms);
  const payload = JSON.stringify(publicCms).replaceAll("<", "\\u003c").replaceAll("&", "\\u0026");

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
