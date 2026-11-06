import type { GoogleReview } from "@/lib/google-reviews";

export const bbbProfileUrl =
  "https://www.bbb.org/us/ca/san-diego/profile/handyman/primefix-home-handyman-services-1126-1000184814";

export const bbbReviewsUrl = `${bbbProfileUrl}/customer-reviews`;

export const bbbListing = {
  rating: null as number | null,
  reviewCount: 0,
  profileUrl: bbbReviewsUrl,
  writeReviewUrl: bbbReviewsUrl,
};

/** Populate from BBB customer reviews when they are published. */
export const bbbReviews: GoogleReview[] = [];
