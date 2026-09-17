"use client";

import { useId, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { googleListing, googleReviews } from "@/lib/google-reviews";

const PREVIEW_LENGTH = 168;
const DESKTOP_PAGE_SIZE = 3;

export function Reviews() {
  const headingId = "reviews-heading";
  const statusId = useId();
  const [start, setStart] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const visible = Array.from({ length: DESKTOP_PAGE_SIZE }, (_, index) => {
    return googleReviews[(start + index) % googleReviews.length];
  });

  function shift(step: number) {
    setStart((current) => {
      const next = (current + step) % googleReviews.length;
      return next < 0 ? next + googleReviews.length : next;
    });
  }

  return (
    <section id="reviews" aria-labelledby={headingId} className="border-b border-border">
      <div className="container-page py-20 md:py-28">
        <h2
          id={headingId}
          className="text-center text-4xl font-medium tracking-[-0.03em] md:text-5xl"
        >
          What clients say
        </h2>

        <div className="mx-auto mt-10 flex w-full max-w-4xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-muted/70 px-5 py-4 sm:flex-row sm:rounded-full sm:py-3">
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm">
            <span className="text-lg font-medium tabular-nums">{googleListing.rating.toFixed(1)}</span>
            <span className="inline-flex items-center gap-0.5" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star
                  key={index}
                  size={16}
                  className="fill-[#fbbc04] text-[#fbbc04]"
                />
              ))}
            </span>
            <span className="text-muted-foreground">
              {googleListing.reviewCount} Google Reviews
            </span>
            <GoogleMark />
          </p>
          <a
            href={googleListing.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-foreground hover:text-background"
          >
            Review us on Google
          </a>
        </div>

        <div className="relative mt-10 px-6 md:px-8">
          <p id={statusId} className="sr-only" aria-live="polite">
            Showing Google reviews, starting with {visible[0].author}
          </p>
          <ul className="grid gap-4 md:grid-cols-3">
            {visible.map((review, index) => {
              const isLong = review.quote.length > PREVIEW_LENGTH;
              const isOpen = Boolean(expanded[review.id]);
              const text =
                isLong && !isOpen
                  ? `${review.quote.slice(0, PREVIEW_LENGTH).trimEnd()}…`
                  : review.quote;

              return (
                <li
                  key={`${review.id}-${start}`}
                    className={`flex min-h-68 flex-col rounded-2xl border border-border bg-card p-6 ${
                    index === 0 ? "" : "hidden md:flex"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground"
                    >
                      {initials(review.author)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{review.author}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{review.dateLabel}</p>
                    </div>
                  </div>
                  <p className="mt-3 inline-flex items-center gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }, (_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className="fill-[#fbbc04] text-[#fbbc04]"
                        aria-hidden="true"
                      />
                    ))}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{text}</p>
                  {isLong ? (
                    <button
                      type="button"
                      className="mt-3 self-start text-sm font-medium text-accent transition-colors duration-200 hover:text-foreground"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [review.id]: !current[review.id],
                        }))
                      }
                    >
                      {isOpen ? "Show less" : "Read more"}
                    </button>
                  ) : (
                    <a
                      href={googleListing.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 self-start text-sm font-medium text-accent transition-colors duration-200 hover:text-foreground"
                    >
                      Read more
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={() => shift(-1)}
            aria-controls={statusId}
            className="absolute top-1/2 left-1 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_8px_24px_rgb(23_23_23/0.12)] transition-colors duration-200 hover:bg-foreground hover:text-background md:left-0 md:-translate-x-1/2"
          >
            <ChevronLeft size={18} aria-hidden="true" />
            <span className="sr-only">Previous reviews</span>
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            aria-controls={statusId}
            className="absolute top-1/2 right-1 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-[0_8px_24px_rgb(23_23_23/0.12)] transition-colors duration-200 hover:bg-foreground hover:text-background md:right-0 md:translate-x-1/2"
          >
            <ChevronRight size={18} aria-hidden="true" />
            <span className="sr-only">Next reviews</span>
          </button>
        </div>
      </div>
    </section>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0].slice(0, 1)}${parts.at(-1)?.slice(0, 1) ?? ""}`.toUpperCase();
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true">
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
