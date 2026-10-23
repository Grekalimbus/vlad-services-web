import { live, readCms } from "@/lib/cms/read";
import { LANDING_SLUGS } from "@/lib/seo";
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

export const activeCategories = live(() => serviceCategories.filter((category) => category.status === "active"));
export const activeServices = live(() => services.filter((service) => service.status === "active"));
export const featuredCategories = live(() => activeCategories.filter((category) => category.featured));
export const quoteServices = featuredCategories;

export function getCategory(slug: string) {
  return activeCategories.find((category) => category.slug === slug);
}

export function getCategoryById(id: string) {
  return serviceCategories.find((category) => category.id === id);
}

export function getService(slug: string) {
  return activeServices.find((service) => service.slug === slug);
}

export function servicesInCategory(categoryId: string) {
  return activeServices.filter((service) => service.categoryId === categoryId && service.id !== categoryId);
}

export function packagesForService(serviceId: string) {
  return servicePackages.filter((item) => item.serviceId === serviceId);
}

export function serviceHref(service: Pick<Service, "slug">) {
  return routes.service(service.slug);
}

export function categoryHref(category: Pick<ServiceCategory, "slug">) {
  return routes.service(category.slug);
}

export function landingForSlug(slug: string) {
  const category = getCategory(slug);
  if (category?.featured) return category;
  const service = getService(slug);
  if (!service) return undefined;
  const parent = getCategoryById(service.categoryId);
  if (parent?.status === "active") return parent;
  return undefined;
}

export function formatStartingAt(amount: number, currency: "USD" = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const serviceRouteSlugs = featuredCategories
  .map((category) => category.slug)
  .filter((slug) => (LANDING_SLUGS as readonly string[]).includes(slug));
