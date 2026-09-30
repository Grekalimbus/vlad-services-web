"use client";

import { useEffect, useRef, useState } from "react";
import { trustItems } from "@/lib/content";
import styles from "./trust.module.css";

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target]);

  return value;
}

function TrustStat({
  value,
  suffix,
  label,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const current = useCountUp(value, active);
  return (
    <li className={styles.item}>
      <p className={styles.value}>
        {current.toLocaleString("de-DE")}
        {suffix}
      </p>
      <h3 className={styles.cardHeading}>{label}</h3>
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
