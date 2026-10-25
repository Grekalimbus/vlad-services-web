"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCms } from "@/lib/cms/use-cms";
import styles from "./review-popup.module.css";

const STORAGE_KEY = "primefix-review-popups";
const SHOW_MS = 3000;
const EXIT_MS = 500;
const COOLDOWN_MS = 3 * 60 * 1000;
const DELAYS_MS = [3000, 5000, 15000];

type Review = {
  id: string;
  author: string;
  rating: number;
  quote: string;
};

type Cycle = {
  startedAt: number;
  offset: number;
};

type Active = {
  review: Review;
  token: number;
  leaving?: boolean;
};

function windows(startedAt: number) {
  let cursor = startedAt;
  return DELAYS_MS.map((delay) => {
    const showAt = cursor + delay;
    const hideAt = showAt + SHOW_MS;
    cursor = hideAt;
    return { showAt, hideAt };
  });
}

function cooldownEnds(startedAt: number) {
  const slots = windows(startedAt);
  return slots[slots.length - 1].hideAt + COOLDOWN_MS;
}

function readCycle(): Cycle | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Cycle>;
    if (typeof parsed.startedAt !== "number" || typeof parsed.offset !== "number") return null;
    return { startedAt: parsed.startedAt, offset: parsed.offset };
  } catch {
    return null;
  }
}

function writeCycle(cycle: Cycle) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
  } catch {
    // Private mode can block storage; the in-memory schedule still runs.
  }
}

export function ReviewPopup() {
  const pathname = usePathname();
  const admin = pathname.startsWith("/admin");
  const reviews = useCms().googleReviews as Review[];
  const signature = reviews.map((review) => review.id).join("|");
  const [active, setActive] = useState<Active | null>(null);

  useEffect(() => {
    if (admin || reviews.length === 0) return;
    let cancelled = false;
    const timers: number[] = [];

    const clearTimers = () => {
      for (const id of timers) window.clearTimeout(id);
      timers.length = 0;
    };

    const schedule = (cycle: Cycle) => {
      clearTimers();
      const now = Date.now();
      const slots = windows(cycle.startedAt);
      slots.forEach((slot, index) => {
        if (now >= slot.hideAt) return;
        const review = reviews[(cycle.offset + index) % reviews.length];
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setActive({ review, token: slot.showAt });
          }, Math.max(0, slot.showAt - Date.now())),
        );
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              setActive((current) =>
                current?.token === slot.showAt ? { ...current, leaving: true } : current,
              );
            }
          }, Math.max(0, slot.hideAt - Date.now())),
        );
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              setActive((current) => (current?.token === slot.showAt ? null : current));
            }
          }, Math.max(0, slot.hideAt - Date.now()) + EXIT_MS),
        );
      });
      timers.push(
        window.setTimeout(() => {
          if (cancelled) return;
          const next = { startedAt: Date.now(), offset: cycle.offset + slots.length };
          writeCycle(next);
          setActive(null);
          schedule(next);
        }, Math.max(0, cooldownEnds(cycle.startedAt) - Date.now())),
      );
    };

    const stored = readCycle();
    const now = Date.now();
    const expired = !stored || now >= cooldownEnds(stored.startedAt);
    const cycle = expired
      ? { startedAt: now, offset: stored ? stored.offset + DELAYS_MS.length : 0 }
      : stored;
    if (expired) writeCycle(cycle);
    schedule(cycle);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [admin, reviews, signature]);

  if (admin || !active) return null;

  const quote = active.review.quote.trim();
  const rating = Math.max(0, Math.min(5, Math.round(active.review.rating)));
  const initial = active.review.author.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className={styles.slot} aria-live="polite">
      <article className={active.leaving ? `${styles.popup} ${styles.leaving}` : styles.popup} key={active.token}>
        <span className={styles.avatar} aria-hidden="true">
          {initial}
        </span>
        <div className={styles.body}>
          <p className={styles.meta}>
            <span className={styles.author}>{active.review.author}</span>
            <span className={styles.stars} aria-label={`${rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={14}
                  className={index < rating ? styles.star : styles.starEmpty}
                  aria-hidden="true"
                />
              ))}
            </span>
          </p>
          <p className={styles.quote}>{quote}</p>
        </div>
        <span className={styles.track} aria-hidden="true">
          <span className={styles.bar} />
        </span>
      </article>
    </div>
  );
}
