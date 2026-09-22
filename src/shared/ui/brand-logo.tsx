import Image from "next/image";
import { assetPath, site } from "@/lib/site";
import styles from "./brand-logo.module.css";

type BrandLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "header" | "footer";
};

export function BrandLogo({
  className = "",
  priority = false,
  size = "header",
}: BrandLogoProps) {
  const dimensions = size === "footer" ? styles.footer : styles.header;

  return (
    <span className={`${styles.logo} ${dimensions} ${className}`}>
      <Image
        src={assetPath(site.logo)}
        alt={site.shortName}
        fill
        priority={priority}
        sizes={size === "footer" ? "288px" : "200px"}
        className={styles.image}
      />
    </span>
  );
}
