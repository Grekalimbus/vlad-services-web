"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ClipboardList, Shield, Users } from "lucide-react";
import { trustItems } from "@/lib/content";
import styles from "./trust.module.css";

const icons = {
  warranty: Shield,
  clients: Users,
  projects: ClipboardList,
  days: Calendar,
} as const;

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

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
  id,
  value,
  suffix,
  label,
  active,
}: {
  readonly id: keyof typeof icons;
  readonly value: number;
  readonly suffix: string;
  readonly label: string;
  readonly active: boolean;
}) {
  const current = useCountUp(value, active);
  const Icon = icons[id];
  return (
    <li className={styles.item}>
      <span className={styles.icon} aria-hidden="true">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div className={styles.copy}>
        <p className={styles.value}>
          {current.toLocaleString("de-DE")}
          {suffix}
        </p>
        <h3 className={styles.cardHeading}>{label}</h3>
      </div>
    </li>
  );
}

export function Trust() {
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
          WHY US?
        </h2>
        <ul className={styles.grid}>
          {trustItems.map((item) => (
            <TrustStat
              key={item.id}
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
