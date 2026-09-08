import Image from "next/image";
import { works } from "@/lib/content";

export function Works() {
  return (
    <section id="works" aria-labelledby="works-heading" className="border-b border-border bg-card">
      <div className="container-page py-20 md:py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Work</p>
            <h2
              id="works-heading"
              className="mt-4 font-serif text-4xl font-medium tracking-tight md:text-5xl"
            >
              Quiet results
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            The room stays yours. We add a level screen and order in the cables.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-12 md:gap-6">
          {works.map((work, index) => {
            const wide = index % 2 === 0;
            return (
              <li
                key={work.src}
                className={wide ? "md:col-span-7" : "md:col-span-5"}
              >
                <figure>
                  <div
                    className={`relative overflow-hidden rounded-sm bg-muted ${
                      wide ? "aspect-[4/3] md:aspect-[16/11]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={work.src}
                      alt={work.alt}
                      fill
                      sizes={
                        wide
                          ? "(min-width: 768px) 58vw, 100vw"
                          : "(min-width: 768px) 42vw, 100vw"
                      }
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-foreground">
                    {work.caption}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
