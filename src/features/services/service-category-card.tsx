import Image from "next/image";
import Link from "next/link";
import { MousePointerClick } from "lucide-react";
import { categoryHref, type ServiceCategory } from "@/lib/services";
import { assetPath } from "@/lib/site";
import styles from "./service-category-card.module.css";

export function ServiceCategoryCard({
  category,
  heading = "h3",
}: {
  readonly category: ServiceCategory;
  readonly heading?: "h2" | "h3";
}) {
  return (
    <Link
      href={categoryHref(category)}
      className={styles.card}
    >
      <div className={styles.header}>
        {heading === "h2" ? (
          <h2 className={styles.title}>{category.name}</h2>
        ) : (
          <h3 className={styles.title}>{category.name}</h3>
        )}
      </div>
      {category.coverImage ? (
        <div className={styles.media}>
          <Image
            src={assetPath(category.coverImage)}
            alt={category.coverAlt ?? category.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className={styles.image}
          />
          <div
            className={styles.imageOverlay}
            aria-hidden="true"
          />
        </div>
      ) : null}
      <span className={styles.action}>
        {category.name}
        <MousePointerClick
          size={18}
          strokeWidth={2}
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
