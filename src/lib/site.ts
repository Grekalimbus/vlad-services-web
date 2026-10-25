import { live, readCms } from "@/lib/cms/read";
import { publicOrigin } from "@/lib/seo";

export const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path.startsWith("/") ? path : `/${path}`}`;

export const routes = {
  home: "/",
  services: "/#services",
  service: (slug: string) => `/services/${slug}`,
  contact: "/#footer",
  privacy: "/privacy-policy",
  messagingTerms: "/messaging-terms",
} as const;

export function phoneHref(display: string) {
  const digits = display.replace(/\D/g, "");
  if (!digits) return "tel:";
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
}

/**
 * Public company identity only.
 * Do not add the registered business address to this object or to any
 * public-facing component. That address is private and must stay off the site.
 */
export const site = live(() => {
  const value = readCms().site;
  return {
    ...value,
    phoneHref: phoneHref(value.phoneDisplay),
    url: publicOrigin(),
    websiteHost: "primefixpros.com",
    locale: "en_US" as const,
  };
});

export const ctas = live(() => ({
  ...readCms().ctas,
  call: readCms().site.phoneDisplay,
}));

export const nav = live(() => readCms().nav);
export const footerNav = live(() => readCms().footerNav);
export const legalNav = live(() => readCms().legalNav);
