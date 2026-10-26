import type { Review, ReviewSummary } from '@/types';

// Buckets the reviews by their rounded rating (5 stars first).
export const getProductReviewsSummary = (
  reviews: Array<Pick<Review, 'rating'>>
): ReviewSummary => {
  const ratingSummary: ReviewSummary['ratingSummary'] = [
    { 5: 0 },
    { 4: 0 },
    { 3: 0 },
    { 2: 0 },
    { 1: 0 }
  ];
  let totalRatings = 0;
  let totalReviews = 0;
  let totalSummary = 0;

  reviews.forEach(item => {
    totalRatings += item.rating;
    totalReviews += 1;

    const stars = Math.round(item.rating);
    if (stars >= 1 && stars <= 5) {
      ratingSummary[5 - stars][stars] += 1;
      totalSummary += 1;
    }
  });

  return { ratingSummary, totalRatings, totalReviews, totalSummary };
};
