import type { MetadataRoute } from "next";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const cms = await bindCms();
  const meta = pageMeta("/", cms);
  return {
    name: cms.site.legalName,
    short_name: cms.site.shortName,
    description: meta.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f5f4f2",
    theme_color: "#f5f4f2",
    lang: "en-US",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}
