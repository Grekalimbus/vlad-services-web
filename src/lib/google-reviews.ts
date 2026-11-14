export type GoogleReview = {
  id: string;
  author: string;
  dateLabel: string;
  rating: number;
  quote: string;
  /** Optional customer photos attached to the review (R2 / site paths). */
  photos?: string[];
};
