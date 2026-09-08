import Image from "next/image";
import { assetPath } from "@/lib/site";

export function Works() {
  return (
    <section
      id="works"
      aria-labelledby="works-heading"
      className="overflow-hidden border-b border-border bg-card"
    >
      <div className="md:grid md:min-h-[90svh] md:grid-cols-12">
        <figure className="relative min-h-[72vh] bg-muted md:order-2 md:col-span-8 md:col-start-5 md:min-h-0">
          <Image
            src={assetPath("/works/tv-fireplace.jpg")}
            alt="Bright living room after a clean installation visit"
            fill
            sizes="(min-width: 768px) 68vw, 100vw"
            className="object-cover object-[70%_50%]"
          />
          <figcaption className="absolute right-5 bottom-5 text-[0.6875rem] tracking-wide text-white/70">
            Living room · finished visit
          </figcaption>
        </figure>

        <div className="flex flex-col justify-center px-5 py-14 md:order-1 md:col-span-4 md:px-8 md:py-20 lg:pl-10 xl:pl-[max(2rem,calc((100vw-72rem)/2))] xl:pr-8">
          <p className="eyebrow">Work</p>
          <h2
            id="works-heading"
            className="mt-5 max-w-[8ch] text-4xl font-medium tracking-[-0.035em] md:text-5xl lg:text-[3.35rem] lg:leading-[1.08]"
          >
            Quiet results
          </h2>
          <p className="mt-6 max-w-[17rem] text-[0.9375rem] leading-7 text-muted-foreground">
            The room stays yours. We add a level screen and order in the cables.
          </p>

          <p className="mt-12 flex items-center gap-3 text-[0.75rem] leading-5 text-muted-foreground">
            <span className="font-medium text-accent">03</span>
            <span className="h-px w-5 bg-accent/60" aria-hidden="true" />
            Years on the workmanship
          </p>
          <p className="mt-2 text-[0.75rem] leading-5 text-muted-foreground">
            Concealed cables · no visible trace
          </p>
        </div>
      </div>
    </section>
  );
}
