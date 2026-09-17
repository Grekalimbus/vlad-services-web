import Link from "next/link";
import { TvQuoteCta } from "@/components/cta";
import { PackageCards } from "@/components/package-cards";
import { buttonPrimaryClass } from "@/lib/forms";
import { mountTypes, packagesForService, tvAddons } from "@/lib/services";
import { routes } from "@/lib/site";

export function TvMounting() {
  const packages = packagesForService("tv-mounting");

  return (
    <section id="tv" aria-labelledby="tv-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">TV mounting projects</p>
          <h2
            id="tv-heading"
            className="mt-4 text-4xl font-medium tracking-[-0.03em] md:text-5xl"
          >
            Mounted as if it were always there
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            The bracket is chosen for the screen and the wall. Level, load, and cables are
            finished before we leave. Drywall, masonry, tile, and timber.
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {mountTypes.map((item, index) => (
            <li key={item.id} className="bg-background p-7 md:p-9">
              <p className="text-[0.75rem] font-medium text-accent">0{index + 1}</p>
              <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em] md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-px grid gap-px overflow-hidden rounded-sm border border-t-0 border-border bg-border md:grid-cols-3">
          {tvAddons.map((item) => (
            <article key={item.id} className="bg-card p-7 md:p-9">
              <h3 className="text-sm font-semibold tracking-wide">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14">
          <PackageCards packages={packages} form="tv" />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <TvQuoteCta className={buttonPrimaryClass} />
          <Link
            href={routes.service("tv-mounting")}
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-medium"
          >
            TV mounting page
          </Link>
        </div>
      </div>
    </section>
  );
}
