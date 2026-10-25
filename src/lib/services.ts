import { live, readCms } from "@/lib/cms/read";
import { categoryForPageSlug, pageSlugForCategory, TEMPLATE_PAGE_SLUGS } from "@/lib/service-pages";
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

export const serviceCategories = live(() => readCms().serviceCategories as ServiceCategory[]);
export const services = live(() => readCms().services as Service[]);
export const servicePackages = live(() => readCms().servicePackages as ServicePackage[]);
export const tvCounts = live(() => readCms().tvCounts);
export const tvSizes = live(() => readCms().tvSizes);
export const wallTypes = live(() => readCms().wallTypes);
export const mountTypes = live(() => readCms().mountTypes);
export const tvAddons = live(() => readCms().tvAddons);
export const concealmentOptions = live(() => readCms().concealmentOptions);
export const mountTypeOptions = live(() => readCms().mountTypeOptions);

const activeCategories = live(() => serviceCategories.filter((category) => category.status === "active"));
const activeServices = live(() => services.filter((service) => service.status === "active"));
const featuredCategories = live(() => activeCategories.filter((category) => category.featured));
export const quoteServices = featuredCategories;

function getCategoryById(id: string) {
  return serviceCategories.find((category) => category.id === id);
}

function getService(slug: string) {
  return activeServices.find((service) => service.slug === slug);
}

export function categoryHref(category: Pick<ServiceCategory, "slug">) {
  return routes.service(category.slug);
}

export function servicePageHref(category: Pick<ServiceCategory, "id" | "slug">) {
  const slug = pageSlugForCategory(category, serviceCategories);
  return slug ? routes.service(slug) : "/#footer";
}

export function landingForSlug(slug: string) {
  const mapped = categoryForPageSlug(slug, serviceCategories);
  if (mapped?.status === "active" && mapped.featured) return mapped;
  const service = getService(slug);
  if (!service) return undefined;
  const parent = getCategoryById(service.categoryId);
  if (parent?.status === "active" && parent.featured && pageSlugForCategory(parent, serviceCategories)) return parent;
  return undefined;
}

export const serviceRouteSlugs = ["tv-mounting", "electrical", "handyman", ...TEMPLATE_PAGE_SLUGS];
