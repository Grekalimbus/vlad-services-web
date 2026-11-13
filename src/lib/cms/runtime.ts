import { productionReadEnv } from "./production-read";
import type { CmsEnv } from "./types";

/**
 * Production Worker: D1 and R2.
 * Local Next.js: read-only production D1. There is no local CMS document.
 */
export async function getCmsEnv(): Promise<CmsEnv> {
  if (process.env.CMS_RUNTIME === "cloudflare") {
    try {
      const { getCloudflareContext } = await import("@opennextjs/cloudflare");
      const { env } = await getCloudflareContext({ async: true });
      return env as CmsEnv;
    } catch (error) {
      console.error("Cloudflare CMS context failed", error);
      throw error;
    }
  }
  return productionReadEnv();
}
