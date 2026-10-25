export type HeroSlide = {
  image: string;
  alt: string;
  position?: string;
};

type HeroSource = {
  image?: string;
  imageAlt?: string;
  imageNext?: string;
  imageNextAlt?: string;
  slides?: unknown;
};

export function heroSlides(hero: HeroSource): HeroSlide[] {
  if (Array.isArray(hero.slides)) {
    return hero.slides.flatMap((slide) => {
      if (!slide || typeof slide !== "object") return [];
      const record = slide as { image?: unknown; alt?: unknown; position?: unknown };
      if (typeof record.image !== "string" || !record.image) return [];
      return [
        {
          image: record.image,
          alt: typeof record.alt === "string" ? record.alt : "",
          ...(typeof record.position === "string" ? { position: record.position } : {}),
        },
      ];
    });
  }

  const seeded: HeroSlide[] = [];
  if (hero.image) seeded.push({ image: hero.image, alt: hero.imageAlt || "" });
  if (hero.imageNext && hero.imageNext !== hero.image) {
    seeded.push({ image: hero.imageNext, alt: hero.imageNextAlt || "" });
  }
  return seeded;
}
