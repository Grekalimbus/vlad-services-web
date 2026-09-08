import Image from "next/image";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative h-dvh max-h-dvh overflow-hidden bg-foreground"
    >
      <Image
        src="/works/hero.jpg"
        alt="Large television and soundbar mounted above a marble fireplace, cables concealed"
        fill
        priority
        quality={75}
        sizes="100vw"
        className="object-cover object-[58%_62%]"
      />
      <div
        className="absolute inset-0 bg-black/15"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-black/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-[min(42rem,70%)] bg-linear-to-r from-black/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-end">
        <div className="container-page w-full pb-12 pt-28 md:pb-16">
          <h1
            id="hero-heading"
            className="max-w-[14ch] font-serif text-[2.85rem] font-medium leading-[0.96] tracking-tight text-white sm:max-w-none sm:text-6xl md:text-7xl lg:text-[4.75rem]"
          >
            <span className="block">Your television</span>
            <span className="block">belongs on the wall.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/82 sm:text-lg">
            Concealed cables, fireplace work, and a three-year warranty — any
            hour, any day.
          </p>
          <a
            href="#plan"
            className="mt-7 inline-flex min-h-12 cursor-pointer items-center rounded-sm bg-background px-8 text-sm font-semibold text-foreground transition-opacity duration-200 hover:opacity-90"
          >
            Plan the visit
          </a>
        </div>
      </div>
    </section>
  );
}
