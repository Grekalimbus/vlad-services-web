export type GalleryKind = "project" | "before-after";

export type GalleryCategory = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  serviceCategoryId?: string;
};

export type GallerySubcategory = {
  id: string;
  slug: string;
  categoryId: string;
  name: string;
};

export type GalleryItem = {
  id: string;
  categoryId: string;
  subcategoryId: string | null;
  title: string;
  summary?: string;
  alt: string;
  kind: GalleryKind;
  src: string | null;
  beforeSrc?: string | null;
  afterSrc?: string | null;
};

export const galleryCategories: GalleryCategory[] = [
  {
    id: "tv-mounting",
    slug: "tv-mounting",
    name: "TV Mounting",
    summary: "Wall-mounted televisions, concealment, and related setups.",
    serviceCategoryId: "tv-mounting",
  },
  {
    id: "electrical",
    slug: "electrical",
    name: "Electrical",
    summary: "Light fixtures, ceiling fans, outlets, and switches.",
    serviceCategoryId: "electrical",
  },
  {
    id: "handyman",
    slug: "handyman",
    name: "Handyman projects",
    summary: "Furniture, painting, hanging, and other home repairs.",
    serviceCategoryId: "handyman",
  },
  {
    id: "before-after",
    slug: "before-after",
    name: "Before & After",
    summary: "Side-by-side examples of a cleaner finished look.",
  },
];

export const gallerySubcategories: GallerySubcategory[] = [
  { id: "tv-mounting", slug: "tv-mounting", categoryId: "tv-mounting", name: "TV Mounting" },
  { id: "tv-concealment", slug: "tv-concealment", categoryId: "tv-mounting", name: "Cable Concealment" },
  { id: "tv-fireplace", slug: "tv-fireplace", categoryId: "tv-mounting", name: "Fireplace" },
  { id: "lighting-fixtures", slug: "fixtures", categoryId: "electrical", name: "Fixtures" },
  { id: "electrical-fans", slug: "fans", categoryId: "electrical", name: "Ceiling fans" },
  { id: "electrical-outlets", slug: "outlets", categoryId: "electrical", name: "Outlets & switches" },
  { id: "furniture-assembly", slug: "assembly", categoryId: "handyman", name: "Assembly" },
  { id: "handyman-paint", slug: "paint", categoryId: "handyman", name: "Walls & paint" },
  { id: "handyman-general", slug: "general", categoryId: "handyman", name: "General" },
  { id: "before-after-tv", slug: "tv", categoryId: "before-after", name: "TV Mounting" },
  { id: "before-after-home", slug: "home", categoryId: "before-after", name: "Home repairs" },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "tv-1",
    categoryId: "tv-mounting",
    subcategoryId: "tv-fireplace",
    title: "Fireplace TV Mount",
    summary: "Clean install above the hearth",
    src: "/works/hero.jpg",
    alt: "Wall-mounted television above a fireplace",
    kind: "project",
  },
  {
    id: "tv-2",
    categoryId: "tv-mounting",
    subcategoryId: "tv-mounting",
    title: "Living Room TV Mount",
    summary: "Flush wall install with a clean finish",
    src: "/works/tv-living-blue.jpg",
    alt: "Large wall-mounted television with a soundbar",
    kind: "project",
  },
  {
    id: "tv-3",
    categoryId: "tv-mounting",
    subcategoryId: "tv-concealment",
    title: "TV Mounting & Cable Concealment",
    summary: "Clean installation with hidden wiring",
    src: "/works/tv-office-wall.jpg",
    alt: "Television mounted flush on a white wall",
    kind: "project",
  },
  {
    id: "tv-4",
    categoryId: "tv-mounting",
    subcategoryId: "tv-mounting",
    title: "Wood-Panel TV Wall",
    summary: "Mounted flush on a finished wood wall",
    src: "/works/tv-wood-wall.jpg",
    alt: "Television mounted on a wood wall panel",
    kind: "project",
  },
  {
    id: "tv-5",
    categoryId: "tv-mounting",
    subcategoryId: "tv-mounting",
    title: "Apartment Living Room Mount",
    summary: "Compact wall install in a finished room",
    src: "/works/gallery-wall.jpg",
    alt: "Wall-mounted television in a living room",
    kind: "project",
  },
  {
    id: "tv-6",
    categoryId: "tv-mounting",
    subcategoryId: "tv-mounting",
    title: "Kitchen TV Mount",
    summary: "Wall-mounted screen in the kitchen",
    src: "/works/ceiling-fan-2.jpg",
    alt: "Television mounted on a kitchen wall",
    kind: "project",
  },
  {
    id: "light-1",
    categoryId: "electrical",
    subcategoryId: "lighting-fixtures",
    title: "Light Fixture Installation",
    summary: "New chandelier hung and wired",
    src: "/works/pexels-bedroom-tv.jpg",
    alt: "Chandelier hanging in a finished room",
    kind: "project",
  },
  {
    id: "light-2",
    categoryId: "electrical",
    subcategoryId: "lighting-fixtures",
    title: "Pendant Light Installation",
    summary: "Cluster fixtures installed and leveled",
    src: "/works/chandelier-crystal.jpg",
    alt: "Cluster of hanging pendant lights",
    kind: "project",
  },
  {
    id: "light-3",
    categoryId: "electrical",
    subcategoryId: "lighting-fixtures",
    title: "Kitchen & Dining Lighting",
    summary: "Island pendants and a dining fixture",
    src: "/works/pexels-kitchen.jpg",
    alt: "Kitchen island pendant lights and a dining chandelier",
    kind: "project",
  },
  {
    id: "fan-1",
    categoryId: "electrical",
    subcategoryId: "electrical-fans",
    title: "Ceiling Fan Installation",
    summary: "Fan hung, wired, and balanced",
    src: "/works/tv-living-cream.jpg",
    alt: "Living room with ceiling fans and a wall-mounted television",
    kind: "project",
  },
  {
    id: "elec-1",
    categoryId: "electrical",
    subcategoryId: "electrical-outlets",
    title: "Electrical Work",
    summary: "On-site fixture and wiring service",
    src: "/works/electrician.jpg",
    alt: "Technician completing electrical work",
    kind: "project",
  },
  {
    id: "elec-2",
    categoryId: "electrical",
    subcategoryId: "electrical-outlets",
    title: "Outlet Installation",
    summary: "New outlets and clean wiring",
    src: "/works/wiring.jpg",
    alt: "Electrical panel and wiring",
    kind: "project",
  },
  {
    id: "furn-1",
    categoryId: "handyman",
    subcategoryId: "furniture-assembly",
    title: "Furniture Assembly",
    summary: "Sofa and seating assembled on site",
    src: "/works/furniture.jpg",
    alt: "Assembled sofa in a living room",
    kind: "project",
  },
  {
    id: "furn-2",
    categoryId: "handyman",
    subcategoryId: "furniture-assembly",
    title: "Sofa & Seating Assembly",
    summary: "Furniture built and placed",
    src: "/works/pexels-sofa.jpg",
    alt: "Leather sofa after assembly",
    kind: "project",
  },
  {
    id: "hang-1",
    categoryId: "handyman",
    subcategoryId: "handyman-general",
    title: "Custom Closet & Shelving",
    summary: "Shelves and hanging storage mounted securely",
    src: "/works/furniture-pexels.jpg",
    alt: "Wall-mounted shelves and hanging lights",
    kind: "project",
  },
  {
    id: "paint-1",
    categoryId: "handyman",
    subcategoryId: "handyman-paint",
    title: "Interior Wall Repair & Painting",
    summary: "Drywall prep, patching & fresh paint",
    src: "/works/pexels-drywall.jpg",
    alt: "Painter rolling a wall during an interior paint job",
    kind: "project",
  },
  {
    id: "paint-2",
    categoryId: "handyman",
    subcategoryId: "handyman-paint",
    title: "Interior Painting",
    summary: "Room prep and a fresh coat",
    src: "/works/ceiling-fan.jpg",
    alt: "Ladder, roller, and paint prepared for a room",
    kind: "project",
  },
  {
    id: "wall-1",
    categoryId: "handyman",
    subcategoryId: "handyman-paint",
    title: "Drywall Repair",
    summary: "Patch, smooth, and ready for paint",
    src: "/works/pexels-electrician.jpg",
    alt: "Hand smoothing a patched wall",
    kind: "project",
  },
  {
    id: "ba-1",
    categoryId: "before-after",
    subcategoryId: "before-after-tv",
    title: "TV Mounting Before & After",
    summary: "From floor cords to a clean wall mount",
    src: "/works/hero.jpg",
    alt: "Before and after of moving a television onto the wall",
    kind: "before-after",
    beforeSrc: "/works/pexels-tv-black.jpg",
    afterSrc: "/works/hero.jpg",
  },
  {
    id: "ba-2",
    categoryId: "before-after",
    subcategoryId: "before-after-home",
    title: "Interior Finish Before & After",
    summary: "From a paint visit to a finished room",
    src: "/works/pexels-kitchen.jpg",
    alt: "Before and after of interior painting and fixture work",
    kind: "before-after",
    beforeSrc: "/works/pexels-drywall.jpg",
    afterSrc: "/works/pexels-kitchen.jpg",
  },
];

export function getGalleryCategory(slug: string) {
  return galleryCategories.find((category) => category.slug === slug);
}

export function subcategoriesIn(categoryId: string) {
  return gallerySubcategories.filter((item) => item.categoryId === categoryId);
}

export function itemsInCategory(categoryId: string, subcategoryId?: string) {
  return galleryItems.filter((entry) => {
    if (entry.categoryId !== categoryId) return false;
    if (subcategoryId) return entry.subcategoryId === subcategoryId;
    return true;
  });
}
