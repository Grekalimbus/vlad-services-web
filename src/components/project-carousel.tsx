"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { galleryItems } from "@/lib/gallery";
import { assetPath } from "@/lib/site";

const timing = [2000, 3000, 5000, 10000, 10000, 10000];

export function ProjectCarousel() {
  const slides = useMemo(() => {
    const available = galleryItems.flatMap((item) => {
      const images = [
        item.src ? { src: item.src, alt: item.alt, title: item.title } : null,
        item.beforeSrc
          ? { src: item.beforeSrc, alt: `Before: ${item.title}`, title: item.title }
          : null,
        item.afterSrc
          ? { src: item.afterSrc, alt: `After: ${item.title}`, title: item.title }
          : null,
      ];
      return images.filter((image): image is NonNullable<typeof image> => Boolean(image));
    });
    return Array.from({ length: 20 }, (_, index) => available[index % available.length]);
  }, []);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const delay = timing[Math.min(active, timing.length - 1)];

  useEffect(() => {
    if (paused) return;
    const timeout = window.setTimeout(() => {
      setPrevious(active);
      setActive((active + 1) % slides.length);
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [active, delay, paused, slides.length]);

  useEffect(() => {
    if (previous === null) return;
    const timeout = window.setTimeout(() => setPrevious(null), 1200);
    return () => window.clearTimeout(timeout);
  }, [active, previous]);

  function move(step: number) {
    setPrevious(active);
    setActive((active + step + slides.length) % slides.length);
  }

  const slide = slides[active];
  const previousSlide = previous === null ? null : slides[previous];

  return (
    <div className="mx-auto mt-12 max-w-5xl">
      <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-muted sm:aspect-[16/9]">
        {previousSlide ? (
          <div
            key={`previous-${previous}-${active}`}
            className="project-slide-exit absolute inset-0"
            aria-hidden="true"
          >
            <Image
              src={assetPath(previousSlide.src)}
              alt=""
              fill
              sizes="(min-width: 1152px) 64rem, 100vw"
              className="object-cover"
            />
          </div>
        ) : null}
        <div key={`active-${active}`} className="project-slide-enter absolute inset-0">
          <Image
            src={assetPath(slide.src)}
            alt={slide.alt}
            fill
            sizes="(min-width: 1152px) 64rem, 100vw"
            className="project-image-motion object-cover"
            style={{ animationDuration: `${delay + 1200}ms` }}
            priority={active === 0}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-black/75 to-transparent px-5 pb-6 pt-20 text-center text-white">
          <p key={active} className="project-caption text-lg font-medium">
            {slide.title}
          </p>
        </div>
        <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/20" aria-hidden="true">
          <span
            key={`${active}-${paused}`}
            className="carousel-progress block h-full origin-left bg-white"
            style={{
              animationDuration: `${delay}ms`,
              animationPlayState: paused ? "paused" : "running",
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => move(-1)}
          className="absolute left-3 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-all hover:scale-105 hover:bg-white"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span className="sr-only">Previous project</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          className="absolute right-3 top-1/2 z-20 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-lg transition-all hover:scale-105 hover:bg-white"
        >
          <ChevronRight size={20} aria-hidden="true" />
          <span className="sr-only">Next project</span>
        </button>
      </div>
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-background"
          aria-label={paused ? "Play project carousel" : "Pause project carousel"}
        >
          {paused ? <Play size={17} aria-hidden="true" /> : <Pause size={17} aria-hidden="true" />}
        </button>
        <p className="text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {active + 1} / {slides.length}
        </p>
      </div>
    </div>
  );
}
