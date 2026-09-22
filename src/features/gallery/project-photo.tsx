import Image from "next/image";
import { assetPath } from "@/lib/site";
import styles from "./project-photo.module.css";

type ProjectPhotoProps = {
  src: string;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
};

export function ProjectPhoto({
  src,
  alt,
  label,
  className = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
}: ProjectPhotoProps) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={styles.media}>
        <Image
          src={assetPath(src)}
          alt={alt}
          fill
          sizes={sizes}
          className={styles.image}
        />
      </div>
      {label ? (
        <figcaption className={styles.caption}>
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function BeforeAfterPhoto({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  label,
  className = "",
}: {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  label?: string;
  className?: string;
}) {
  return (
    <figure className={`${styles.figure} ${className}`}>
      <div className={styles.split}>
        <div className={styles.splitMedia}>
          <Image
            src={assetPath(beforeSrc)}
            alt={beforeAlt}
            fill
            sizes="50vw"
            className={styles.image}
          />
          <p className={styles.badge}>
            Before
          </p>
        </div>
        <div className={styles.splitMedia}>
          <Image
            src={assetPath(afterSrc)}
            alt={afterAlt}
            fill
            sizes="50vw"
            className={styles.image}
          />
          <p className={styles.badge}>
            After
          </p>
        </div>
      </div>
      {label ? (
        <figcaption className={styles.caption}>
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
