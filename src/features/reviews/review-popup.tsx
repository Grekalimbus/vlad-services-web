"use client";

import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCms } from "@/lib/cms/use-cms";
import styles from "./review-popup.module.css";

const STORAGE_KEY = "primefix-review-popups";
const SHOW_MS = 3000;
const EXIT_MS = 500;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const COOLDOWNS_MS = [HOUR_MS, DAY_MS];
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
  wave: number;
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

function cooldownMs(wave: number) {
  return COOLDOWNS_MS[wave % COOLDOWNS_MS.length];
}

function cooldownEnds(cycle: Cycle) {
  const slots = windows(cycle.startedAt);
  return slots[slots.length - 1].hideAt + cooldownMs(cycle.wave);
}

function readCycle(): Cycle | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Cycle>;
    if (typeof parsed.startedAt !== "number" || typeof parsed.offset !== "number") return null;
    const wave = typeof parsed.wave === "number" && parsed.wave >= 0 ? Math.floor(parsed.wave) : 0;
    return { startedAt: parsed.startedAt, offset: parsed.offset, wave };
  } catch {
    return null;
  }
}

function writeCycle(cycle: Cycle) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cycle));
  } catch {
    void 0;
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
          const next = {
            startedAt: Date.now(),
            offset: cycle.offset + slots.length,
            wave: (cycle.wave + 1) % COOLDOWNS_MS.length,
          };
          writeCycle(next);
          setActive(null);
          schedule(next);
        }, Math.max(0, cooldownEnds(cycle) - Date.now())),
      );
    };

    const stored = readCycle();
    const now = Date.now();
    const expired = !stored || now >= cooldownEnds(stored);
    const cycle = expired
      ? {
          startedAt: now,
          offset: stored ? stored.offset + DELAYS_MS.length : 0,
          wave: stored ? (stored.wave + 1) % COOLDOWNS_MS.length : 0,
        }
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
          <span className={styles.googleBadge}>
            <GoogleMark />
          </span>
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

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className={styles.googleMark} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09A6.97 6.97 0 0 1 5.48 12c0-.72.13-1.43.36-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
      />
    </svg>
  );
}
