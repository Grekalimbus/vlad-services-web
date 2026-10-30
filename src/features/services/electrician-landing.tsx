"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CalendarClock, ClipboardList, CreditCard, Phone, type LucideIcon } from "lucide-react";
import { AreasSection } from "@/features/areas";
import { FaqSection } from "@/features/faq/faq-section";
import { DealsSignup } from "@/features/home/deals-signup";
import { useQuote } from "@/features/quote";
import { electricalLandingFrom } from "@/lib/cms/electrical-landing";
import { useCms } from "@/lib/cms/use-cms";
import { assetPath } from "@/lib/site";
import styles from "./electrician-landing.module.css";

const stepIcons: LucideIcon[] = [ClipboardList, Phone, CalendarClock, CreditCard];

const prices = [
  { amount: 125, label: "Chandelier" },
  { amount: 95, label: "Flush Fit Light" },
  { amount: 120, label: "Ceiling Fan" },
  { amount: 110, label: "Outlet" },
  { amount: 100, label: "Dimmer/Switch" },
  { amount: 75, label: "Panel Check/Reset" },
] as const;

export function ElectricianLanding({
  category,
}: {
  category: { id: string; name: string; coverImage?: string };
}) {
  const cms = useCms();
  const landing = electricalLandingFrom(cms);
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
              <img
                src={assetPath(icon.src)}
                alt=""
                width={88}
                height={88}
                className={styles.iconImage}
              />
              <span className={styles.iconLabel} data-cms={`copy.serviceLanding.${category.id}.icons.${index}.text`}>
                {icon.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <section className={styles.story} data-side="start" aria-labelledby="electrical-story-title">
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
                  className={styles.storyImage}
                />
              </figure>
            ) : null}
            <div className={styles.storyCopy}>
              <h1 id="electrical-story-title" className={styles.storyTitle} data-cms="copy.serviceLanding.electrical.description.title">
                {landing.description.title}
              </h1>
              <div className={styles.storyBody} data-cms="copy.serviceLanding.electrical.description.body">
                {paragraphs(landing.description.body)}
              </div>
            </div>
          </div>
          <PriceGrid />
        </div>
      </section>
      <section className={styles.quiz} aria-labelledby="after-quiz-heading">
        <h2 id="after-quiz-heading" className={styles.quizHeading} data-cms="copy.serviceLanding.electrical.stepsHeading">
          <QuizHeading text={landing.stepsHeading} />
        </h2>
        <ol className={styles.steps}>
          {landing.steps.map((step, index) => {
            const Icon = stepIcons[index] ?? ClipboardList;
            return (
              <li key={`${step.title}-${index}`} className={styles.step}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {index + 1}
                </span>
                <div className={styles.stepCard}>
                  <span className={styles.stepIcon} aria-hidden="true">
                    <Icon strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className={styles.stepTitle} data-cms={`copy.serviceLanding.electrical.steps.${index}.title`}>
                      {step.title}
                    </h3>
                    <p className={styles.stepText} data-cms={`copy.serviceLanding.electrical.steps.${index}.text`}>
                      {step.text}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </section>
      <FaqSection
        id="electrical-faq"
        headingId="electrical-faq-heading"
        headingLead={landing.faq.headingLead}
        headingAccent={landing.faq.headingAccent}
        items={landing.faq.items}
        paths={{
          headingLead: "copy.serviceLanding.electrical.faq.headingLead",
          headingAccent: "copy.serviceLanding.electrical.faq.headingAccent",
          item: (index, field) => `copy.serviceLanding.electrical.faq.items.${index}.${field}`,
        }}
      />
      <AreasSection id="areas" />
      <DealsSignup id="electrical-deals" />
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

function PriceCard({ amount, label, active }: { amount: number; label: string; active: boolean }) {
  const current = useCountUp(amount, active);
  return (
    <li className={styles.priceCard}>
      <p className={styles.priceValue}>
        <span aria-hidden="true">${current}</span>
        <span className={styles.priceFinal}>${amount}</span>
      </p>
      <p className={styles.priceLabel}>{label}</p>
    </li>
  );
}

function PriceGrid() {
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
    <ul ref={listRef} className={styles.priceGrid} aria-label="Electrician prices">
      {prices.map((item) => (
        <PriceCard key={item.label} amount={item.amount} label={item.label} active={active} />
      ))}
    </ul>
  );
}

function QuizHeading({ text }: { text: string }) {
  const match = text.match(/^(.*?)(\bquiz\b)(.*)$/i);
  if (!match) return text;
  return (
    <>
      {match[1]}
      <span className={styles.quizWord}>{match[2]}</span>
      {match[3]}
    </>
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => <p key={block.slice(0, 32)}>{block}</p>);
}
