"use client";

import Image from "next/image";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./brand-logo.module.css";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  plain?: boolean;
};

export function BrandLogo({
  className = "",
  priority = false,
  plain = false,
}: BrandLogoProps) {
  const site = useCms().site;
  return (
    <span className={`${styles.logo} ${styles.header} ${plain ? styles.plain : ""} ${className}`}>
      <Image
        src={assetPath(site.logo)}
        alt={site.shortName}
        fill
        priority={priority}
        sizes="200px"
        className={styles.image}
      />
    </span>
  );
}
