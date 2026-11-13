import { publicOrigin } from "@/lib/seo";

export const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path.startsWith("/") ? path : `/${path}`}`;

export const routes = {
  home: "/",
  service: (slug: string) => `/services/${slug}`,
  areas: "/areas",
  blog: "/blog",
  privacy: "/privacy-policy",
  messagingTerms: "/messaging-terms",
} as const;

export function phoneHref(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "tel:";
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

export function siteUrl() {
  return publicOrigin();
}
