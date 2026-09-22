import { BeforeAfterPhoto, ProjectPhoto } from "./project-photo";
import styles from "./media-placeholder.module.css";

type MediaPlaceholderProps = {
  label: string;
  caption?: string;
  className?: string;
  variant?: "frame" | "split";
  src?: string | null;
  alt?: string;
  beforeSrc?: string | null;
  afterSrc?: string | null;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function MediaPlaceholder({
  label,
  caption,
  className = "",
  variant = "frame",
  src,
  alt,
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
}: MediaPlaceholderProps) {
  if (variant === "split") {
    if (beforeSrc && afterSrc) {
      return (
        <BeforeAfterPhoto
          beforeSrc={beforeSrc}
          afterSrc={afterSrc}
          beforeAlt={beforeAlt ?? `Before: ${label}`}
          afterAlt={afterAlt ?? `After: ${label}`}
          label={caption ?? label}
          className={className}
        />
      );
    }
  }

  if (src) {
    return (
      <ProjectPhoto
        src={src}
        alt={alt ?? label}
        label={caption ?? label}
        className={className}
      />
    );
  }

  return (
    <figure
      className={`${styles.placeholder} ${className}`}
    >
      <div className={styles.placeholderInner}>
        <p className={styles.placeholderEyebrow}>
          Project photo
        </p>
        <p className={styles.placeholderTitle}>{label}</p>
      </div>
    </figure>
  );
}
