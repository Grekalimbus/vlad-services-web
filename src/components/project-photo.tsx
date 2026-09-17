import Image from "next/image";
import { assetPath } from "@/lib/site";

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
    <figure className={`overflow-hidden rounded-sm border border-border bg-muted ${className}`}>
      <div className="relative aspect-4/3 min-h-52 md:min-h-64">
        <Image
          src={assetPath(src)}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
      </div>
      {label ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
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
    <figure className={`overflow-hidden rounded-sm border border-border bg-muted ${className}`}>
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="relative aspect-4/3 min-h-40">
          <Image
            src={assetPath(beforeSrc)}
            alt={beforeAlt}
            fill
            sizes="50vw"
            className="object-cover"
          />
          <p className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide uppercase">
            Before
          </p>
        </div>
        <div className="relative aspect-4/3 min-h-40">
          <Image
            src={assetPath(afterSrc)}
            alt={afterAlt}
            fill
            sizes="50vw"
            className="object-cover"
          />
          <p className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium tracking-wide uppercase">
            After
          </p>
        </div>
      </div>
      {label ? (
        <figcaption className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}
