import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CallNow, QuoteCta } from "@/components/cta";
import { assetPath, ctas, site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative h-dvh max-h-dvh overflow-hidden bg-foreground"
    >
      <Image
        src={assetPath("/works/hero.jpg")}
        alt="Finished living room with a wall-mounted television"
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
        <div className="container-page w-full pb-32 pt-28 sm:pb-14 md:pb-16 lg:pb-20">
          <div className="max-w-88 sm:max-w-104 md:max-w-md">
            <p className="text-[0.8125rem] font-medium text-[#9eb6c4]">
              {site.areaServedShort} · TV mounting, electrical & handyman
            </p>

            <h1
              id="hero-heading"
              className="mt-4 text-[2.35rem] font-medium leading-[1.08] tracking-[-0.035em] text-white sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.6rem]"
            >
              Your television belongs on the wall.
            </h1>

            <p className="mt-4 max-w-88 text-[0.9375rem] leading-6 text-white/78">
              TV mounting, electrical, and general handyman work. Insured, with a two-year
              workmanship guarantee.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <QuoteCta className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-5 text-[0.8125rem] font-medium text-accent-foreground transition-colors duration-200 hover:bg-white hover:text-foreground">
                {ctas.quote}
              </QuoteCta>
              <CallNow className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/35 px-5 text-[0.8125rem] font-medium text-white transition-colors duration-200 hover:bg-white hover:text-foreground">
                {ctas.call}
                <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
              </CallNow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
