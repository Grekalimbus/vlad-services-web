"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, ClipboardList, Shield, Users } from "lucide-react";
import { useCms } from "@/lib/cms/use-cms";
import styles from "./trust.module.css";

const icons = {
  warranty: Shield,
  clients: Users,
  projects: ClipboardList,
  days: Calendar,
  business: Briefcase,
} as const;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    if (reduce) {
      frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const duration = 2000;
    const start = performance.now();
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

function TrustStat({
  index,
  id,
  value,
  suffix,
  label,
  active,
}: {
  readonly index: number;
  readonly id: string;
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  readonly active: boolean;
}) {
  const current = useCountUp(value, active);
  const Icon = icons[id as keyof typeof icons] ?? icons.warranty;
  return (
    <li className={styles.item} data-cms-card={`trust:${id}`}>
      <span className={styles.icon} aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div className={styles.copy}>
        <p className={styles.value}>
          {current.toLocaleString("en-US")}
          {suffix}
        </p>
        <h3 className={styles.cardHeading} data-cms={`trustItems.${index}.label`}>{label}</h3>
      </div>
    </li>
  );
}

export function Trust() {
  const cms = useCms();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="trust"
      ref={sectionRef}
      aria-labelledby="trust-heading"
      className={styles.section}
    >
      <div className={styles.container}>
        <h2 id="trust-heading" className={styles.heading}>
          <span data-cms="copy.home.trustHeading">{cms.copy.home.trustHeading}</span>
        </h2>
        <ul className={styles.grid}>
          {cms.trustItems.map((item, index) => (
            <TrustStat
              key={item.id}
              index={index}
              id={item.id}
              value={item.value}
              suffix={item.suffix}
              label={item.label}
              active={active}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
