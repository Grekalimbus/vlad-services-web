import type { GoogleReview } from "@/lib/google-reviews";
import { socialLinks } from "@/lib/social";

export const yelpListing = {
  rating: null as number | null,
  reviewCount: 0,
  profileUrl: socialLinks.yelp,
  writeReviewUrl: socialLinks.yelp,
};

export const yelpReviews: GoogleReview[] = [];
