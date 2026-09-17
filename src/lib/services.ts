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

export const serviceCategories: ServiceCategory[] = [
  {
    id: "tv-mounting",
    slug: "tv-mounting",
    name: "TV Mounting",
    featured: true,
    status: "active",
    summary:
      "Television mounting for any screen size, plus in-wall or external cable concealment and a power outlet for the TV.",
    form: "tv",
    coverImage: "/works/hero.jpg",
    coverAlt: "Wall-mounted television above a fireplace",
  },
  {
    id: "electrical",
    slug: "electrical",
    name: "Electrical",
    featured: true,
    status: "active",
    summary: "Chandeliers and light fixtures, ceiling fans, outlets, and switches.",
    form: "quote",
    coverImage: "/works/pexels-bedroom-tv.jpg",
    coverAlt: "Chandelier installed in a finished room",
  },
  {
    id: "handyman",
    slug: "handyman",
    name: "General Handyman Services",
    featured: true,
    status: "active",
    summary:
      "Furniture assembly, wall repair, painting, hanging, replacements, and other small jobs around the house.",
    form: "quote",
    coverImage: "/works/furniture.jpg",
    coverAlt: "Assembled sofa in a living room",
  },
  {
    id: "remodeling",
    slug: "remodeling",
    name: "Remodeling",
    featured: false,
    status: "planned",
    summary: "Reserved for future remodeling services.",
    form: "quote",
  },
  {
    id: "appliance-repair",
    slug: "appliance-repair",
    name: "Appliance Repair",
    featured: false,
    status: "planned",
    summary: "Reserved for future appliance repair services.",
    form: "quote",
  },
];

export const services: Service[] = [
  {
    id: "tv-mounting",
    slug: "tv-mounting",
    categoryId: "tv-mounting",
    name: "TV Mounting",
    summary: "Professional television mounting for homes in San Diego.",
    featured: true,
    status: "active",
    form: "tv",
  },
  {
    id: "cable-concealment",
    slug: "cable-concealment",
    categoryId: "tv-mounting",
    name: "In-Wall Cable Concealment",
    summary: "Hide power and HDMI lines inside the wall where the finish allows.",
    featured: false,
    status: "active",
    form: "tv",
  },
  {
    id: "external-concealment",
    slug: "external-concealment",
    categoryId: "tv-mounting",
    name: "External Cable Concealment",
    summary: "A painted raceway or cover when the wall cannot be opened.",
    featured: false,
    status: "active",
    form: "tv",
  },
  {
    id: "tv-outlet",
    slug: "tv-outlet",
    categoryId: "tv-mounting",
    name: "TV Outlet Installation",
    summary: "A power outlet behind or beside the television.",
    featured: false,
    status: "active",
    form: "tv",
  },
  {
    id: "light-fixture-installation",
    slug: "light-fixture-installation",
    categoryId: "electrical",
    name: "Chandeliers & Light Fixtures",
    summary: "Installation of chandeliers, pendants, and other interior light fixtures.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "ceiling-fan-installation",
    slug: "ceiling-fan-installation",
    categoryId: "electrical",
    name: "Ceiling Fans",
    summary: "Ceiling fan mounting and replacement.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "minor-electrical",
    slug: "minor-electrical",
    categoryId: "electrical",
    name: "Outlets & Switches",
    summary: "Outlets, switches, and other minor electrical work.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "furniture-assembly",
    slug: "furniture-assembly",
    categoryId: "handyman",
    name: "Furniture Assembly",
    summary: "Assembly of household furniture.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "picture-hanging",
    slug: "picture-hanging",
    categoryId: "handyman",
    name: "Picture, Art & Mirror Hanging",
    summary: "Hanging pictures, artwork, and mirrors.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "drywall-repair",
    slug: "drywall-repair",
    categoryId: "handyman",
    name: "Wall Repair & Patching",
    summary: "Patching and repair of drywall and walls.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "painting",
    slug: "painting",
    categoryId: "handyman",
    name: "Painting & Touch-Ups",
    summary: "Interior painting and touch-up work.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "curtain-rods-blinds",
    slug: "curtain-rods-blinds",
    categoryId: "handyman",
    name: "Curtain Rod & Blinds Installation/Repair",
    summary: "Install or repair curtain rods and blinds.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "door-window-repairs",
    slug: "door-window-repairs",
    categoryId: "handyman",
    name: "Door & Window Repairs",
    summary: "Repair work for doors and windows.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "custom-closet",
    slug: "custom-closet",
    categoryId: "handyman",
    name: "Custom Closet Installation",
    summary: "Installation of custom closet systems.",
    featured: false,
    status: "active",
    form: "quote",
  },
  {
    id: "general-handyman",
    slug: "general-handyman",
    categoryId: "handyman",
    name: "Other Small Repairs",
    summary: "Replacements and other small home repairs.",
    featured: false,
    status: "active",
    form: "quote",
  },
];

export const servicePackages: ServicePackage[] = [
  {
    id: "tv-standard",
    serviceId: "tv-mounting",
    name: "Standard TV mounting",
    summary: "One television on a finished interior wall.",
    startingAt: null,
    currency: "USD",
  },
  {
    id: "tv-fireplace",
    serviceId: "tv-mounting",
    name: "Fireplace or masonry mount",
    summary: "Mounting above a fireplace or on brick, stone, or similar walls.",
    startingAt: null,
    currency: "USD",
  },
];

export const tvCounts = [
  {
    id: "1",
    count: "1",
    screens: 1,
    title: "One television",
    note: "A single wall",
    duration: "About an hour for a straightforward living-room mount",
    follow:
      "Most visits are one screen. Height, studs, and cables are checked before the bracket goes in.",
  },
  {
    id: "2",
    count: "2",
    screens: 2,
    title: "A pair",
    note: "Two rooms",
    duration: "A morning",
    follow: "Two mounts in one visit, finished to the same standard.",
  },
  {
    id: "3",
    count: "3",
    screens: 3,
    title: "Three screens",
    note: "A coordinated pass",
    duration: "A half day",
    follow: "Three mounts sequenced so tools and dust stay contained.",
  },
  {
    id: "4plus",
    count: "4+",
    screens: 4,
    title: "Four or more",
    note: "The whole house",
    duration: "Planned on site",
    follow:
      "Larger homes need a short walkthrough so walls, power, and order are confirmed first.",
  },
] as const;

export type TvCountId = (typeof tvCounts)[number]["id"];

export const tvSizes = [
  '32" or smaller',
  '43"',
  '50"',
  '55"',
  '65"',
  '75"',
  '85" or larger',
  "Not sure",
] as const;

export const wallTypes = [
  { id: "drywall", label: "Drywall" },
  { id: "brick", label: "Brick" },
  { id: "stone", label: "Stone" },
  { id: "other", label: "Other" },
  { id: "not-sure", label: "Not Sure" },
] as const;

export const mountTypes = [
  {
    id: "fixed",
    title: "Fixed mount",
    text: "The television sits close to the wall and stays in place. Best when you watch from one seat.",
    image: "/works/tv-office-wall.jpg",
    alt: "Television mounted flush on a wall",
  },
  {
    id: "tilt",
    title: "Tilting mount",
    text: "The screen angles down. Useful above a fireplace or when the TV sits higher than eye line.",
    image: "/works/hero.jpg",
    alt: "Television mounted above a fireplace",
  },
  {
    id: "motion",
    title: "Full-motion",
    text: "The arm extends and swivels so the screen can turn toward a second seat or a kitchen.",
    image: "/works/gallery-wall.jpg",
    alt: "Wall-mounted television in a living room",
  },
  {
    id: "ceiling",
    title: "Ceiling TV mounting",
    text: "The television hangs from the ceiling. Used in bedrooms, gyms, and rooms without a free wall.",
    image: "/works/tv-living-cream.jpg",
    alt: "Living room with a wall-mounted television and ceiling fixtures",
  },
] as const;

export const tvAddons = [
  {
    id: "in-wall",
    title: "In-wall cable concealment",
    text: "Power and HDMI run inside the wall so the screen sits clean, with no cords dropping to the floor.",
    image: "/works/tv-living-blue.jpg",
    alt: "Wall-mounted television with a clean cable line",
  },
  {
    id: "external",
    title: "External cable concealment",
    text: "A painted raceway or cover hides cords when the wall cannot be opened.",
    image: "/works/tv-wood-wall.jpg",
    alt: "Television mounted on a wood wall panel",
  },
  {
    id: "tv-outlet",
    title: "TV outlet installation",
    text: "A power outlet behind or beside the television so the cord does not drop to a floor receptacle.",
    image: "/works/wiring.jpg",
    alt: "Electrical work for a power connection",
  },
] as const;

export const concealmentOptions = [
  { id: "in-wall", label: "In-wall" },
  { id: "external", label: "External" },
  { id: "no", label: "No" },
  { id: "not-sure", label: "Not Sure" },
] as const;

export const mountTypeOptions = [
  { id: "fixed", label: "Fixed" },
  { id: "tilt", label: "Tilting" },
  { id: "motion", label: "Full-motion" },
  { id: "ceiling", label: "Ceiling" },
  { id: "not-sure", label: "Not Sure" },
] as const;

export const activeCategories = serviceCategories.filter(
  (category) => category.status === "active",
);

export const activeServices = services.filter((service) => service.status === "active");

export const featuredCategories = activeCategories.filter((category) => category.featured);

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
  return activeServices.filter(
    (service) => service.categoryId === categoryId && service.id !== categoryId,
  );
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

export const serviceRouteSlugs = Array.from(
  new Set([
    ...featuredCategories.map((category) => category.slug),
    ...activeServices.map((service) => service.slug),
  ]),
);
