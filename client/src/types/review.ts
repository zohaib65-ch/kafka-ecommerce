import type { REVIEW_STATUS } from '@/lib/constants';

export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

export interface Review {
  _id: string;
  /** Populated (`name slug imageUrl`) in the admin list, an id otherwise. */
  product?:
    | { _id?: string; name: string; slug: string; imageUrl?: string }
    | string
    | null;
  /** Populated with `firstName`. */
  user?: { _id?: string; firstName?: string } | null;
  title: string;
  rating: number;
  review: string;
  isRecommended: boolean;
  status: ReviewStatus;
  created: string;
}

/** Rating buckets, 5 stars first: `[{ 5: n }, { 4: n }, { 3: n }, { 2: n }, { 1: n }]`. */
export type RatingSummary = Array<Record<number, number>>;

export interface ReviewSummary {
  ratingSummary: RatingSummary;
  totalRatings: number;
  totalReviews: number;
  totalSummary: number;
}
