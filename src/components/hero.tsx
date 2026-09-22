import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { QuoteCta } from "@/components/cta";
import { assetPath } from "@/lib/site";

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
        className="scale-[1.02] object-cover object-[36%_42%] blur-[2px] md:object-[42%_40%]"
      />
      <div
        className="absolute inset-0 bg-black/70"
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="container-page py-28 text-center">
          <div className="mx-auto max-w-4xl">
            <h1
              id="hero-heading"
              className="text-[clamp(1.45rem,5.8vw,3.6rem)] font-medium leading-[1.15] tracking-[-0.035em] text-white"
            >
              <span className="block whitespace-nowrap">Take a brief quiz</span>
              <span className="block whitespace-nowrap">
                and get <strong className="font-bold text-[#f6c453]">$30</strong> off your quote
              </span>
            </h1>

            <p className="mt-6 whitespace-nowrap text-[clamp(0.75rem,2.4vw,1.125rem)] font-medium text-white/90">
              1 Hour On Your Site – Serving SoCal Swiftly!
            </p>

            <div className="mt-8 flex flex-col items-center">
              <QuoteCta className="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold tracking-wide text-accent-foreground transition-colors duration-200 hover:bg-white hover:text-foreground">
                LET&apos;S START
              </QuoteCta>
              <a
                href="#services"
                className="scroll-cue mt-10 inline-flex size-11 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:border-white hover:bg-white hover:text-foreground"
                aria-label="Scroll to services"
              >
                <ChevronDown size={20} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
