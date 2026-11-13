export type GalleryCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
};

export type GallerySubcategory = {
  id: string;
  categoryId: string;
  slug: string;
  name: string;
  description: string;
};

export type GalleryItem = {
  id: string;
  categoryId: string;
  subcategoryId: string;
  title: string;
  summary: string;
  alt: string;
  kind: string;
  src: string;
  beforeSrc?: string;
  afterSrc?: string;
};
