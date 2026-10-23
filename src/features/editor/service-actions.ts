import { updateDraft } from "@/lib/cms/edit-store";

export function addHomepageService() {
  updateDraft((document) => {
    const id = `service-${crypto.randomUUID().slice(0, 8)}`;
    const categories = document.serviceCategories as unknown as Array<Record<string, unknown>>;
    categories.push({
      id,
      slug: id,
      name: "New service",
      featured: true,
      status: "active",
      summary: "Describe this service.",
      form: "quote",
      coverImage: "/works/hero.jpg",
    });
    const covers = document.copy.home.serviceCovers as unknown as Array<Record<string, unknown>>;
    covers.push({ id, src: "/works/hero.jpg", position: "center" });
  });
}

export function removeHomepageService(id: string) {
  updateDraft((document) => {
    document.serviceCategories = document.serviceCategories.filter((item) => item.id !== id) as typeof document.serviceCategories;
    document.copy.home.serviceCovers = document.copy.home.serviceCovers.filter((item) => item.id !== id);
    document.services = document.services.filter(
      (item) => item.id !== id && item.categoryId !== id,
    ) as typeof document.services;
  });
}
