import type { Metadata } from "next";
import { bindCms } from "@/lib/cms/load";
import { pageMeta } from "@/lib/seo";

export async function metadataFor(path: string): Promise<Metadata> {
  const meta = pageMeta(path, await bindCms());
  const robots = meta.index
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: meta.follow, googleBot: { index: false, follow: meta.follow } };

  return {
    title: { absolute: meta.title },
    description: meta.description,
    keywords: meta.keywords,
    ...(meta.canonical ? { alternates: { canonical: meta.canonical } } : {}),
    robots,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: meta.canonical || undefined,
      siteName: meta.siteName,
      title: meta.title,
      description: meta.description,
      images: [
        {
          url: meta.image,
          secureUrl: meta.image,
          width: 1024,
          height: 576,
          alt: meta.imageAlt,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  };
}
