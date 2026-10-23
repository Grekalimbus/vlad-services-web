import { live, readCms } from "@/lib/cms/read";

export type GoogleReview = {
  id: string;
  author: string;
  dateLabel: string;
  rating: number;
  quote: string;
};

export const googleListing = live(() => readCms().googleListing);
export const googleReviews = live(() => readCms().googleReviews as GoogleReview[]);
