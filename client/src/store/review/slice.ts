import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PageFilters, Review, ReviewSummary } from '@/types';
import { removeById } from '../utils';

export interface ReviewState {
  /** Dashboard moderation list. */
  reviews: Review[];
  isLoading: boolean;
  advancedFilters: PageFilters;
  /** Approved reviews of the product page product. */
  productReviews: Review[];
  reviewsSummary: ReviewSummary;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  productReviews: [],
  reviewsSummary: {
    ratingSummary: [],
    totalRatings: 0,
    totalReviews: 0,
    totalSummary: 0
  }
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    setReviews(state, action: PayloadAction<Review[]>) {
      state.reviews = action.payload;
    },
    setReviewAdvancedFilters(state, action: PayloadAction<PageFilters>) {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    setProductReviews(
      state,
      action: PayloadAction<{
        reviews: Review[];
        reviewsSummary: ReviewSummary;
      }>
    ) {
      state.productReviews = action.payload.reviews;
      state.reviewsSummary = action.payload.reviewsSummary;
    },
    removeReview(state, action: PayloadAction<string>) {
      state.reviews = removeById(state.reviews, action.payload);
    },
    setReviewsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setReviews,
  setReviewAdvancedFilters,
  setProductReviews,
  removeReview,
  setReviewsLoading
} = reviewSlice.actions;

export default reviewSlice.reducer;
