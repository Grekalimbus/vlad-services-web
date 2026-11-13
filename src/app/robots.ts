import type { MetadataRoute } from "next";
import { publicOrigin } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/admin/", "/api/", "/blog", "/blog/"],
    },
    sitemap: `${publicOrigin()}/sitemap.xml`,
  };
}
