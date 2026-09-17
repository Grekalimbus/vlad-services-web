import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categoryHref, type ServiceCategory } from "@/lib/services";
import { assetPath } from "@/lib/site";

const titleClass =
  "text-2xl font-medium tracking-[-0.03em] transition-colors duration-200 group-hover:text-accent md:text-3xl";

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
      className="group flex cursor-pointer flex-col bg-background transition-colors duration-200 hover:bg-card"
    >
      {category.coverImage ? (
        <div className="relative aspect-4/3 overflow-hidden">
          <Image
            src={assetPath(category.coverImage)}
            alt={category.coverAlt ?? category.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/12"
            aria-hidden="true"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-7 md:p-8">
        {heading === "h2" ? (
          <h2 className={titleClass}>{category.name}</h2>
        ) : (
          <h3 className={titleClass}>{category.name}</h3>
        )}
        <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
          {category.summary}
        </p>
        <span className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors duration-200 group-hover:bg-foreground group-hover:text-background">
          View {category.name}
          <ArrowRight
            size={16}
            strokeWidth={2}
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
