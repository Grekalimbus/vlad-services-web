import type { GoogleReview } from "@/lib/google-reviews";

export const yelpProfileUrl =
  "https://www.yelp.com/biz/primefix-home-and-handyman-services-san-diego-2";

export const yelpReviewsUrl = `${yelpProfileUrl}#reviews`;

export const yelpListing = {
  rating: 5,
  reviewCount: 1,
  profileUrl: yelpReviewsUrl,
  writeReviewUrl: yelpReviewsUrl,
};

export const yelpReviews: GoogleReview[] = [
  {
    id: "gina-c",
    author: "Gina C.",
    dateLabel: "Nov 2026",
    rating: 5,
    quote:
      "Victor was amazing. I had him come 2 different times to hang multiple shelves, (he built some for me as well) and changed my kitchen faucet. He's fast, so nice and respectful, on time, great communication. Would highly recommend him. I will use him for any other projects in the future too.",
  },
];
