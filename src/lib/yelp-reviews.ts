import type { GoogleReview } from "@/lib/google-reviews";

export const yelpProfileUrl =
  "https://www.yelp.com/biz/primefix-home-and-handyman-services-san-diego-2";

export const yelpReviewsUrl = `${yelpProfileUrl}#reviews`;

export const yelpListing = {
  rating: 5,
  reviewCount: 2,
  profileUrl: yelpReviewsUrl,
  writeReviewUrl: yelpReviewsUrl,
};

export const yelpReviews: GoogleReview[] = [
  {
    id: "iryna-w",
    author: "Iryna W.",
    dateLabel: "Nov 2026",
    rating: 5,
    quote:
      "We hired Vlad to hang on a TV in our bedroom, which he did perfectly. Turned out they also do landscape work. I had this front yard vision for years and these guys gave it a life! Smooth and quick execution, they don't waste any time. Highly recommend!",
    photos: [
      "/api/media/uploads/yelp-review-iryna-w-1-f5939706.jpg",
      "/api/media/uploads/yelp-review-iryna-w-2-3620aef2.jpg",
    ],
  },
  {
    id: "gina-c",
    author: "Gina C.",
    dateLabel: "Nov 2026",
    rating: 5,
    quote:
      "Victor was amazing. I had him come 2 different times to hang multiple shelves, (he built some for me as well) and changed my kitchen faucet. He's fast, so nice and respectful, on time, great communication. Would highly recommend him. I will use him for any other projects in the future too.",
  },
];
