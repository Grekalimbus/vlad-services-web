"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AirVent,
  CookingPot,
  DoorOpen,
  Drill,
  Droplets,
  Flower2,
  Hammer,
  House,
  Layers,
  Leaf,
  Microwave,
  Paintbrush,
  PaintRoller,
  Palette,
  Plug,
  Refrigerator,
  Ruler,
  Scissors,
  Shovel,
  Sofa,
  TreePine,
  WashingMachine,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { AreasSection } from "@/features/areas";
import { FaqSection } from "@/features/faq/faq-section";
import { DealsSignup } from "@/features/home/deals-signup";
import { useQuote } from "@/features/quote";
import { serviceLandingFrom } from "@/lib/cms/service-landing";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import { ProcessSteps } from "./process-steps";
import styles from "./electrician-landing.module.css";

const glyphs: Record<string, LucideIcon> = {
  AirVent,
  CookingPot,
  DoorOpen,
  Drill,
  Droplets,
  Flower2,
  Hammer,
  House,
  Layers,
  Leaf,
  Microwave,
  Paintbrush,
  PaintRoller,
  Palette,
  Plug,
  Refrigerator,
  Ruler,
  Scissors,
  Shovel,
  Sofa,
  TreePine,
  WashingMachine,
  Wrench,
};

export function ServiceLanding({
  category,
}: {
  category: { id: string; slug: string; name: string; coverImage?: string };
}) {
  const cms = useCms();
  const landing = serviceLandingFrom(cms, category);
  const copyBase = `copy.serviceLanding.${category.id}`;
  const coverIndex = cms.copy.home.serviceCovers.findIndex((item) => item.id === category.id);
  const cover = coverIndex >= 0 ? cms.copy.home.serviceCovers[coverIndex] : undefined;
  const figureSrc = cover?.src || category.coverImage || "";
  const { openQuote } = useQuote();

  return (
    <>
      <ul className={styles.iconRow}>
        {landing.icons.map((icon, index) => (
          <li key={`${icon.src}-${index}`}>
            <button
              type="button"
              className={styles.iconButton}
              data-cms-card={`serviceIcon:${category.id}:${index}`}
              aria-label={`${icon.text}. Book ${category.name.trim()}`}
              onClick={() => openQuote("quote", undefined, category.name)}
            >
              <LandingIcon src={icon.src} />
              <span className={styles.iconLabel} data-cms={`${copyBase}.icons.${index}.text`}>
                {icon.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <section className={styles.story} data-side="start" aria-labelledby={`${category.slug}-story-title`}>
        <div className={styles.storyLayout}>
          <div className={styles.storyStage}>
            {figureSrc ? (
              <figure className={styles.figure}>
                <Image
                  src={assetPath(figureSrc)}
                  alt={landing.description.imageAlt}
                  data-cms-src={coverIndex >= 0 ? `copy.home.serviceCovers.${coverIndex}.src` : undefined}
                  width={1672}
                  height={940}
                  unoptimized={figureSrc.startsWith("/api/media/")}
                  sizes="(min-width: 800px) 36rem, 100vw"
                  className={category.slug === "electrical" ? styles.storyImage : `${styles.storyImage} ${styles.storyImageFit}`}
                />
              </figure>
            ) : null}
            <div className={styles.storyCopy}>
              <h1 id={`${category.slug}-story-title`} className={styles.storyTitle} data-cms={`${copyBase}.description.title`}>
                {landing.description.title}
              </h1>
              <div className={styles.storyBody} data-cms={`${copyBase}.description.body`}>
                {paragraphs(landing.description.body)}
              </div>
            </div>
          </div>
          <PriceGrid prices={landing.prices} label={category.name.trim()} base={copyBase} />
        </div>
      </section>
      <ProcessSteps
        steps={landing.steps}
        serviceName={category.name}
        pathFor={(index, field) => `${copyBase}.steps.${index}.${field}`}
      />
      <FaqSection
        id={`${category.slug}-faq`}
        headingId={`${category.slug}-faq-heading`}
        headingLead={landing.faq.headingLead}
        headingAccent={landing.faq.headingAccent}
        items={landing.faq.items}
        paths={{
          headingLead: `${copyBase}.faq.headingLead`,
          headingAccent: `${copyBase}.faq.headingAccent`,
          item: (index, field) => `${copyBase}.faq.items.${index}.${field}`,
        }}
      />
      <AreasSection id="areas" />
      <DealsSignup id={`${category.slug}-deals`} />
    </>
  );
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }
    const duration = 3000;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function PriceCard({
  amount,
  label,
  labelPath,
  active,
}: {
  amount: number;
  label: string;
  labelPath: string;
  active: boolean;
}) {
  const current = useCountUp(amount, active);
  return (
    <li className={styles.priceCard}>
      <p className={styles.priceValue}>
        <span aria-hidden="true">${current}</span>
        <span className={styles.priceFinal}>${amount}</span>
      </p>
      <p className={styles.priceLabel} data-cms={labelPath}>
        {label}
      </p>
    </li>
  );
}

function LandingIcon({ src }: { src: string }) {
  if (src.startsWith("lucide:")) {
    const Icon = glyphs[src.slice("lucide:".length)] ?? Wrench;
    return <Icon className={styles.iconGlyph} strokeWidth={1.35} aria-hidden="true" />;
  }
  return <img src={assetPath(src)} alt="" width={88} height={88} className={styles.iconImage} />;
}

function PriceGrid({
  prices,
  label,
  base,
}: {
  prices: { amount: number; label: string }[];
  label: string;
  base: string;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} className={styles.priceGrid} aria-label={`${label} prices`}>
      {prices.map((item, index) => (
        <PriceCard
          key={`${item.label}-${index}`}
          amount={Number(item.amount) || 0}
          label={item.label}
          labelPath={`${base}.prices.${index}.label`}
          active={active}
        />
      ))}
    </ul>
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => <p key={block.slice(0, 32)}>{block}</p>);
}
