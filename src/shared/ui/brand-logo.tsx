import Image from "next/image";
import { assetPath, site } from "@/lib/site";
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
  return (
    <span className={`${styles.logo} ${styles.header} ${plain ? styles.plain : ""} ${className}`}>
      <Image
        src={assetPath(site.logo)}
        alt={site.shortName}
        fill
        priority={priority}
        sizes="184px"
        className={styles.image}
      />
    </span>
  );
}
