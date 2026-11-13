import type { CmsDocument } from "@/lib/cms/types";
import { categoryForPageSlug, pageSlugForCategory, SERVICE_PAGE_SLUGS } from "@/lib/service-pages";
import { routes } from "@/lib/site";

export type CatalogStatus = "active" | "planned";
export type ServiceForm = "quote" | "tv";

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  featured: boolean;
  status: CatalogStatus;
  summary: string;
  form: ServiceForm;
  coverImage?: string;
  coverAlt?: string;
};

export type Service = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
  summary: string;
  featured: boolean;
  status: CatalogStatus;
  form: ServiceForm;
};

export type ServicePackage = {
  id: string;
  serviceId: string;
  name: string;
  summary: string;
  startingAt: number | null;
  currency: "USD";
};

export function categoryHref(category: Pick<ServiceCategory, "slug">) {
  return routes.service(category.slug);
}

export function servicePageHref(
  category: Pick<ServiceCategory, "id" | "slug">,
  categories: Pick<ServiceCategory, "id" | "slug">[],
) {
  const slug = pageSlugForCategory(category, categories);
  return slug ? routes.service(slug) : "/#footer";
}

export function landingForSlug(slug: string, document: CmsDocument) {
  const categories = document.serviceCategories as ServiceCategory[];
  const serviceList = document.services as Service[];
  const mapped = categoryForPageSlug(slug, categories);
  if (mapped?.status === "active" && mapped.featured) return mapped;
  const service = serviceList.find((item) => item.status === "active" && item.slug === slug);
  if (!service) return undefined;
  const parent = categories.find((category) => category.id === service.categoryId);
  if (parent?.status === "active" && parent.featured && pageSlugForCategory(parent, categories)) return parent;
  return undefined;
}

export const serviceRouteSlugs = [...SERVICE_PAGE_SLUGS];
