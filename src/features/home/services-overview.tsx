import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryHref, featuredCategories } from "@/lib/services";
import { assetPath } from "@/lib/site";
import styles from "./services-overview.module.css";

const covers: Record<string, { src: string; position: string }> = {
  "tv-mounting": { src: "/works/hero.jpg", position: "center 34%" },
  electrical: { src: "/works/chandelier-crystal.jpg", position: "center 42%" },
  handyman: { src: "/works/furniture.jpg", position: "center 68%" },
};

export function ServicesOverview() {
  return (
    <section id="services" aria-labelledby="services-heading" className={styles.section}>
      <div className={styles.container}>
        <h2 id="services-heading" className={styles.heading}>
          SERVICES
        </h2>
        <ul className={styles.strip}>
          {featuredCategories.map((category, index) => {
            const cover = covers[category.id];
            const src = cover?.src ?? category.coverImage;
            return (
              <li key={category.id} className={styles.item}>
                <Link href={categoryHref(category)} className={styles.card}>
                  {src ? (
                    <Image
                      src={assetPath(src)}
                      alt=""
                      fill
                      sizes="(min-width: 900px) 36vw, 100vw"
                      className={styles.image}
                      style={{ objectPosition: cover?.position ?? "center" }}
                    />
                  ) : null}
                  <span className={styles.shade} aria-hidden="true" />
                  <span className={styles.index} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.footer}>
                    <span className={styles.title}>{category.name}</span>
                    <span className={styles.arrow} aria-hidden="true">
                      <ArrowRight size={18} strokeWidth={2.25} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
