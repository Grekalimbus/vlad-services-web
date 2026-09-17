import type { MetadataRoute } from "next";
import { galleryCategories } from "@/lib/gallery";
import { legalPages } from "@/lib/legal";
import { serviceRouteSlugs } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["/", "/services", "/portfolio", "/contact"];
  const servicePaths = serviceRouteSlugs.map((slug) => `/services/${slug}`);
  const portfolioPaths = galleryCategories.map(
    (category) => `/portfolio/${category.slug}`,
  );
  const legalPaths = legalPages.map((page) => page.href);

  return [...staticPaths, ...servicePaths, ...portfolioPaths, ...legalPaths].map(
    (path) => ({
      url: `${site.url}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    }),
  );
}
