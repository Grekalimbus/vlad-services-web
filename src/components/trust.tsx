import { trustItems } from "@/lib/content";

export function Trust() {
  return (
    <section id="trust" aria-labelledby="trust-heading" className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">Why call</p>
          <h2
            id="trust-heading"
            className="mt-4 text-4xl font-medium tracking-[-0.03em] md:text-5xl"
          >
            Clear work. San Diego coverage.
          </h2>
        </div>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <li key={item.id} className="bg-background p-7 md:p-9">
              <h3 className="text-lg font-medium tracking-[-0.02em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
