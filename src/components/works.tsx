import Link from "next/link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { ProjectCarousel } from "@/components/project-carousel";
import { itemsInCategory } from "@/lib/gallery";
import { routes } from "@/lib/site";

export function Works() {
  const beforeAfter = itemsInCategory("before-after");

  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="overflow-hidden border-b border-border bg-card"
    >
      <div className="container-page py-20 md:py-28">
        <h2
          id="works-heading"
          className="text-4xl font-medium tracking-[-0.035em] md:text-5xl"
        >
          WHY US?
        </h2>

        <ProjectCarousel />

        <div className="mt-16">
          <h3 className="text-2xl font-medium tracking-[-0.02em]">Before &amp; After</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {beforeAfter.map((entry) => (
              <MediaPlaceholder
                key={entry.id}
                label={entry.title}
                variant="split"
                beforeSrc={entry.beforeSrc}
                afterSrc={entry.afterSrc}
                beforeAlt={`Before: ${entry.title}`}
                afterAlt={`After: ${entry.title}`}
              />
            ))}
          </div>
        </div>

        <Link
          href={routes.portfolio}
          className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          View projects
        </Link>
      </div>
    </section>
  );
}
