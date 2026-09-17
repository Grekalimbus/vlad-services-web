import Link from "next/link";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { itemsInCategory } from "@/lib/gallery";
import { routes } from "@/lib/site";

export function Works() {
  const tvItems = itemsInCategory("tv-mounting").slice(0, 3);
  const beforeAfter = itemsInCategory("before-after");

  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="overflow-hidden border-b border-border bg-card"
    >
      <div className="container-page py-20 md:py-28">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">Project photos</p>
            <h2
              id="works-heading"
              className="mt-4 max-w-[12ch] text-4xl font-medium tracking-[-0.035em] md:text-5xl"
            >
              Quiet results
            </h2>
          </div>
          <p className="max-w-sm text-base leading-7 text-muted-foreground md:col-span-5">
            Wall-mounted televisions, finished rooms, and the kind of small jobs that leave the
            house tidier than we found it.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {tvItems.map((entry) => (
            <MediaPlaceholder
              key={entry.id}
              label={entry.title}
              src={entry.src}
              alt={entry.alt}
            />
          ))}
        </div>

        <div className="mt-16">
          <p className="eyebrow">Before & After</p>
          <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">Side by side</h3>
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

        <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.75rem] leading-5 text-muted-foreground">
          <span className="font-medium text-accent">2 years</span>
          <span>Workmanship guarantee</span>
          <span>San Diego and surrounding areas</span>
        </p>
        <Link href={routes.portfolio} className="mt-6 inline-block text-sm font-medium text-accent">
          View project gallery
        </Link>
      </div>
    </section>
  );
}
