import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal";
import { publicUrl } from "@/lib/seo";
import { serviceRouteSlugs } from "@/lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    ...serviceRouteSlugs.map((slug) => ({
      path: `/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...legalPages.map((page) => ({
      path: page.href,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  return entries.map((entry) => ({
    url: publicUrl(entry.path),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
