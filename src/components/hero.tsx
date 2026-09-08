import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
        className="object-cover object-[36%_42%] md:object-[42%_40%]"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-black/10"
        aria-hidden="true"
      />
      <div
        className="absolute inset-y-0 left-0 w-[min(32rem,72%)] bg-linear-to-r from-black/40 via-black/10 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-end">
        <div className="container-page w-full pb-10 pt-28 sm:pb-14 md:pb-16 lg:pb-20">
          <div className="max-w-88 sm:max-w-104 md:max-w-md">
            <a
              href="#contact"
              className="group inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#9eb6c4] transition-colors duration-200 hover:text-white"
            >
              Available 24 hours daily
              <ArrowRight
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>

            <h1
              id="hero-heading"
              className="mt-4 text-[2.35rem] font-medium leading-[1.08] tracking-[-0.035em] text-white sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.6rem]"
            >
              Your television belongs on the wall.
            </h1>

            <p className="mt-4 max-w-88 text-[0.9375rem] leading-6 text-white/78">
              Concealed cables, fireplace work, and a three-year warranty.
            </p>

            <a
              href="#plan"
              className="group mt-7 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-[0.8125rem] font-medium text-accent-foreground transition-colors duration-200 hover:bg-white hover:text-foreground"
            >
              Plan the visit
              <ArrowRight
                size={15}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
