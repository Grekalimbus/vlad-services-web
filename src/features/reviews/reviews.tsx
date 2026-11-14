"use client";

import { useId, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { angiReviews } from "@/lib/angi-reviews";
import { useCms } from "@/lib/cms/use-cms";
import { bbbListing, bbbReviews } from "@/lib/bbb-reviews";
import { yelpListing, yelpReviews } from "@/lib/yelp-reviews";
import { YelpIcon } from "@/shared/brand-icons";
import shared from "@/styles/shared.module.css";
import { ReviewPhotos, reviewPhotoUrls } from "./review-photos";
import styles from "./reviews.module.css";

const DESKTOP_PAGE_SIZE = 3;
/** Max carousel pages (3 cards each) across every review source. */
const MAX_REVIEW_PAGES = 6;
const MAX_REVIEWS = DESKTOP_PAGE_SIZE * MAX_REVIEW_PAGES;

type SourceId = "google" | "yelp" | "angi" | "bbb";

const SOURCE_ORDER: SourceId[] = ["google", "yelp", "angi", "bbb"];

export function Reviews() {
  const cms = useCms();
  const heading = cms.copy.home.reviews;
  const googleListing = cms.googleListing;
  const googleReviews = cms.googleReviews ?? [];
  const angiListing = cms.angiListing;
  const headingId = "reviews-heading";
  const statusId = useId();
  const [source, setSource] = useState<SourceId>("google");
  const [page, setPage] = useState(0);
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
      emptyHref: angiListing?.profileUrl || "",
    },
    bbb: {
      listing: bbbListing,
      reviews: bbbReviews,
      label: "BBB",
      countLabel: "BBB Reviews",
      writeLabel: "Review us on BBB",
      empty: "No BBB reviews yet",
      emptyCta: "View the BBB page",
      emptyHref: bbbListing.profileUrl,
    },
  } as const;
  const current = catalog[source];
  const listing = current.listing;
  const reviews = current.reviews.slice(0, MAX_REVIEWS);
  const pageCount = Math.max(1, Math.ceil(reviews.length / DESKTOP_PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const countLabel = current.countLabel;
  const writeLabel = current.writeLabel;
  const visible = reviews.slice(safePage * DESKTOP_PAGE_SIZE, safePage * DESKTOP_PAGE_SIZE + DESKTOP_PAGE_SIZE);

  function selectSource(next: SourceId, event?: { preventDefault(): void; stopPropagation(): void }) {
    event?.preventDefault();
    event?.stopPropagation();
    setSource(next);
    setPage(0);
  }

  function shift(step: number) {
    if (reviews.length === 0) return;
    setPage((current) => {
      const next = (current + step) % pageCount;
      return next < 0 ? next + pageCount : next;
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
                <span className={styles.ratingValue} data-cms={source === "google" ? "googleListing.rating" : undefined}>
                  {listing.rating.toFixed(1)}
                </span>
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
              {reviews.length > 0 ? (
                <>
                  <span data-cms={source === "google" ? "googleListing.reviewCount" : undefined}>{listing.reviewCount}</span>{" "}
                  {countLabel}
                </>
              ) : (
                `No ${current.label} reviews yet`
              )}
            </span>
            <span className={styles.sources} role="group" aria-label="Review source">
              {SOURCE_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  className={source === id ? styles.sourceActive : styles.source}
                  aria-pressed={source === id}
                  onClick={(event) => selectSource(id, event)}
                  onPointerDown={(event) => event.stopPropagation()}
                >
                  {id === "google" ? <GoogleMark /> : null}
                  {id === "yelp" ? <YelpIcon className={styles.yelpMark} /> : null}
                  {id === "angi" ? <AngiMark /> : null}
                  {id === "bbb" ? <BbbMark /> : null}
                  <span className={shared.visuallyHidden}>{catalog[id].label} reviews</span>
                </button>
              ))}
            </span>
          </p>
          <a
            href={listing.writeReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.reviewLink}
          >
            {writeLabel}
            <ArrowRight size={16} aria-hidden="true" className={styles.reviewArrow} />
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
              const reviewIndex = safePage * DESKTOP_PAGE_SIZE + index;

              return (
                <ReviewCard
                  key={`${review.id}-${safePage}`}
                  review={review}
                  hidden={index !== 0}
                  authorCmsPath={source === "google" ? `googleReviews.${reviewIndex}.author` : undefined}
                  quoteCmsPath={source === "google" ? `googleReviews.${reviewIndex}.quote` : undefined}
                />
              );
            })}
          </ul>
          )}

          {pageCount > 1 ? <div className={styles.controls}>
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
          {pageCount > 1 ? <div className={styles.dots}>
            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                className={index === safePage ? styles.dotActive : styles.dot}
                aria-label={`Show review page ${index + 1}`}
                aria-current={index === safePage ? "true" : undefined}
                onClick={() => setPage(index)}
              />
            ))}
          </div> : null}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({
  review,
  hidden,
  authorCmsPath,
  quoteCmsPath,
}: {
  review: { id: string; author: string; dateLabel: string; rating: number; quote: string; photos?: string[] };
  hidden: boolean;
  authorCmsPath?: string;
  quoteCmsPath?: string;
}) {
  const photos = reviewPhotoUrls(review.photos);

  return (
    <li className={`${styles.card} ${hidden ? styles.cardHidden : ""}`}>
      <div className={styles.cardHead}>
        <span aria-hidden="true" className={styles.avatar}>
          {initials(review.author)}
        </span>
        <p className={styles.authorName} data-cms={authorCmsPath}>
          {review.author}
        </p>
        <p className={styles.reviewStars} aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, starIndex) => (
            <Star key={starIndex} size={14} className={styles.star} aria-hidden="true" />
          ))}
        </p>
        <p className={styles.date}>{review.dateLabel}</p>
      </div>
      <div className={styles.quote} data-cms={quoteCmsPath}>
        {review.quote}
      </div>
      <ReviewPhotos photos={photos} label={review.author} />
    </li>
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

function BbbMark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/hero/badges/bbb.svg" alt="" className={styles.bbbMark} />
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
