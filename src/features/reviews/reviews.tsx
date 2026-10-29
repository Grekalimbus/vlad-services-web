"use client";

import { useId, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCms } from "@/lib/cms/use-cms";
import { angiListing, angiProfileUrl, angiReviews } from "@/lib/angi-reviews";
import { googleListing, googleReviews } from "@/lib/google-reviews";
import { yelpListing, yelpReviews } from "@/lib/yelp-reviews";
import { YelpIcon } from "@/shared/brand-icons";
import shared from "@/styles/shared.module.css";
import styles from "./reviews.module.css";

const PREVIEW_LENGTH = 168;
const DESKTOP_PAGE_SIZE = 3;

type SourceId = "google" | "yelp" | "angi";

export function Reviews() {
  const heading = useCms().copy.home.reviews;
  const headingId = "reviews-heading";
  const statusId = useId();
  const [source, setSource] = useState<SourceId>("google");
  const [start, setStart] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const catalog = {
    google: {
      listing: googleListing,
      reviews: googleReviews,
      label: "Google",
      countLabel: heading.countSuffix,
      writeLabel: heading.writeReview,
      empty: "No Google reviews yet",
      emptyCta: "View the Google page",
      emptyHref: googleListing.mapsUrl,
    },
    yelp: {
      listing: yelpListing,
      reviews: yelpReviews,
      label: "Yelp",
      countLabel: "Yelp Reviews",
      writeLabel: "Review us on Yelp",
      empty: "Yelp doesn't have recommended reviews for PrimeFix yet.",
      emptyCta: "View the Yelp page",
      emptyHref: yelpListing.profileUrl,
    },
    angi: {
      listing: angiListing,
      reviews: angiReviews,
      label: "Angi",
      countLabel: "Angi Reviews",
      writeLabel: "Review us on Angi",
      empty: "No Angi reviews yet",
      emptyCta: "View the Angi page",
      emptyHref: angiListing.profileUrl || angiProfileUrl,
    },
  } as const;
  const current = catalog[source];
  const listing = current.listing;
  const reviews = current.reviews;
  const countLabel = current.countLabel;
  const writeLabel = current.writeLabel;
  const visible =
    reviews.length === 0
      ? []
      : Array.from({ length: Math.min(DESKTOP_PAGE_SIZE, reviews.length) }, (_, index) => {
          return reviews[(start + index) % reviews.length];
        });

  function selectSource(next: SourceId) {
    setSource(next);
    setStart(0);
    setExpanded(false);
  }

  function shift(step: number) {
    if (reviews.length === 0) return;
    setStart((current) => {
      const next = (current + step) % reviews.length;
      return next < 0 ? next + reviews.length : next;
    });
  }

  return (
    <section id="reviews" aria-labelledby={headingId} className={styles.section}>
      <div className={styles.atmosphere} aria-hidden="true">
        <span className={styles.wash} />
        <span className={`${styles.arc} ${styles.arcTl}`} />
        <span className={`${styles.arc} ${styles.arcTlInner}`} />
        <span className={`${styles.arc} ${styles.arcBl}`} />
        <span className={styles.washRight} />
        <span className={`${styles.arc} ${styles.arcTr}`} />
        <span className={`${styles.arc} ${styles.arcRight}`} />
        <span className={`${styles.arc} ${styles.arcBr}`} />
        <span className={styles.texture} />
      </div>
      <div className={styles.container}>
        <h2
          id={headingId}
          className={styles.heading}
        >
          <span data-cms="copy.home.reviews.headingLead">{heading.headingLead}</span>{" "}
          <span className={styles.headingAccent} data-cms="copy.home.reviews.headingAccent">{heading.headingAccent}</span>
        </h2>

        <div className={styles.summary}>
          <p className={styles.rating}>
            {listing.rating != null ? (
              <>
                <span className={styles.ratingValue}>{listing.rating.toFixed(1)}</span>
                <span className={styles.stars} aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={styles.star}
                    />
                  ))}
                </span>
              </>
            ) : null}
            <span className={styles.muted}>
              {reviews.length > 0 ? `${listing.reviewCount} ${countLabel}` : `No ${current.label} reviews yet`}
            </span>
            <span className={styles.sources} role="group" aria-label="Review source">
              <button
                type="button"
                className={source === "google" ? styles.sourceActive : styles.source}
                aria-pressed={source === "google"}
                onClick={() => selectSource("google")}
              >
                <GoogleMark />
                <span className={shared.visuallyHidden}>Google reviews</span>
              </button>
              <button
                type="button"
                className={source === "yelp" ? styles.sourceActive : styles.source}
                aria-pressed={source === "yelp"}
                onClick={() => selectSource("yelp")}
              >
                <YelpIcon className={styles.yelpMark} />
                <span className={shared.visuallyHidden}>Yelp reviews</span>
              </button>
              <button
                type="button"
                className={source === "angi" ? styles.sourceActive : styles.source}
                aria-pressed={source === "angi"}
                onClick={() => selectSource("angi")}
              >
                <AngiMark />
                <span className={shared.visuallyHidden}>Angi reviews</span>
              </button>
            </span>
          </p>
          <a
            href={listing.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.reviewLink}
          >
            {writeLabel}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className={styles.carousel}>
          <p id={statusId} className={shared.visuallyHidden} aria-live="polite">
            {visible[0]
              ? `Showing ${current.label} reviews, starting with ${visible[0].author}`
              : `No recommended ${current.label} reviews yet`}
          </p>
          {visible.length === 0 ? (
            <div className={styles.empty}>
              <p>{current.empty}</p>
              <a href={current.emptyHref} target="_blank" rel="noopener noreferrer">
                {current.emptyCta}
              </a>
            </div>
          ) : (
          <ul className={styles.list}>
            {visible.map((review, index) => {
              const isLong = review.quote.length > PREVIEW_LENGTH;
              const text =
                isLong && !expanded
                  ? `${review.quote.slice(0, PREVIEW_LENGTH).trimEnd()}…`
                  : review.quote;

              return (
                <li
                  key={`${review.id}-${start}`}
                  className={`${styles.card} ${index === 0 ? "" : styles.cardHidden}`}
                >
                  <div className={styles.cardHead}>
                    <span
                      aria-hidden="true"
                      className={styles.avatar}
                    >
                      {initials(review.author)}
                    </span>
                    <p className={styles.authorName}>{review.author}</p>
                    <p className={styles.reviewStars} aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: review.rating }, (_, index) => (
                        <Star
                          key={index}
                          size={14}
                          className={styles.star}
                          aria-hidden="true"
                        />
                      ))}
                    </p>
                    <p className={styles.date}>{review.dateLabel}</p>
                  </div>
                  <div className={styles.quote}>{text}</div>
                  <button
                    type="button"
                    className={styles.more}
                    onClick={() => setExpanded((current) => !current)}
                  >
                    {expanded ? "Show less" : "Read more"}
                  </button>
                </li>
              );
            })}
          </ul>
          )}

          {reviews.length > 1 ? <div className={styles.controls}>
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-controls={statusId}
              className={styles.previous}
            >
              <ChevronLeft size={18} aria-hidden="true" />
              <span className={shared.visuallyHidden}>Previous reviews</span>
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-controls={statusId}
              className={styles.next}
            >
              <ChevronRight size={18} aria-hidden="true" />
              <span className={shared.visuallyHidden}>Next reviews</span>
            </button>
          </div> : null}
          {reviews.length > 1 ? <div className={styles.dots}>
            {reviews.map((review, index) => (
              <button
                key={review.id}
                type="button"
                className={index === start ? styles.dotActive : styles.dot}
                aria-label={`Show reviews starting with ${review.author}`}
                aria-current={index === start ? "true" : undefined}
                onClick={() => setStart(index)}
              />
            ))}
          </div> : null}
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

function AngiMark() {
  return (
    <svg viewBox="0 0 24 24" className={styles.angiMark} aria-hidden="true">
      <path
        fill="#FF6153"
        d="M12 2.2 3.6 21h3.15l1.55-3.45h7.4L17.25 21H20.4L12 2.2Zm0 5.1 2.72 6.05H9.28L12 7.3Z"
      />
    </svg>
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
