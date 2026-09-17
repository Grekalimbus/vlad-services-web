import { BeforeAfterPhoto, ProjectPhoto } from "@/components/project-photo";

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
      className={`flex min-h-52 flex-col justify-end overflow-hidden rounded-sm border border-dashed border-border bg-muted md:min-h-64 ${className}`}
    >
      <div className="flex flex-1 flex-col items-start justify-end p-5">
        <p className="text-[0.65rem] font-medium tracking-wide text-accent uppercase">
          Project photo
        </p>
        <p className="mt-2 text-lg font-medium tracking-[-0.02em]">{label}</p>
      </div>
    </figure>
  );
}
