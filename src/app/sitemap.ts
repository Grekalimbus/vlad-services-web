import type { MetadataRoute } from "next";
import { bindCms } from "@/lib/cms/load";
import { publicUrl } from "@/lib/seo";
import { serviceRouteSlugs } from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cms = await bindCms();
  const entries: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/areas", changeFrequency: "monthly", priority: 0.8 },
    { path: "/deals", changeFrequency: "weekly", priority: 0.7 },
    ...serviceRouteSlugs.map((slug) => ({
      path: `/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...[...new Set([...cms.legalPages.map((page) => page.href), "/privacy-policy", "/messaging-terms"])].map((path) => ({
      path,
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
