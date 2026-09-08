import { mountTypes, tvExtras } from "@/lib/content";

export function TvMounting() {
  return (
    <section id="tv" aria-labelledby="tv-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">The work</p>
          <h2
            id="tv-heading"
            className="mt-4 font-serif text-4xl font-medium tracking-tight md:text-5xl"
          >
            Mounted as if it were always there
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            The bracket is chosen for the screen and the wall. Level, load, and
            cables are finished before we leave. Drywall, masonry, tile, and
            timber.
          </p>
        </div>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {mountTypes.map((item, index) => (
            <li key={item.id} className="bg-background p-7 md:p-9">
              <p className="font-mono text-[0.68rem] tracking-[0.14em] text-accent">
                0{index + 1}
              </p>
              <h3 className="mt-5 font-serif text-2xl font-medium md:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-px grid gap-px overflow-hidden rounded-sm border border-t-0 border-border bg-border md:grid-cols-3">
          {tvExtras.map((item) => (
            <article key={item.title} className="bg-card p-7 md:p-9">
              <h3 className="text-sm font-semibold tracking-wide">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
