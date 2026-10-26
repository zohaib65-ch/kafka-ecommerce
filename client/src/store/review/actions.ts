import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import { sanitizeFields } from '@/lib/sanitize';
import type { AddReviewValues } from '@/lib/validations/review';
import type { AppThunk } from '@/store';
import type { MessageResponse, PageFilters, Review } from '@/types';
import { getProductReviewsSummary } from './summary';
import {
  removeReview,
  setProductReviews,
  setReviewAdvancedFilters,
  setReviews,
  setReviewsLoading
} from './slice';

export { getProductReviewsSummary } from './summary';

const REVIEWS_PER_PAGE = 20;

// fetch reviews api (dashboard moderation list)
export const fetchReviews =
  (page?: number): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setReviewsLoading(true));

      const response = await axios.get<PageFilters & { reviews: Review[] }>(
        `${API_URL}/review`,
        {
          params: {
            page: page ?? 1,
            limit: REVIEWS_PER_PAGE
          }
        }
      );

      const { reviews, totalPages, currentPage, count } = response.data;

      dispatch(setReviews(reviews));
      dispatch(setReviewAdvancedFilters({ totalPages, currentPage, count }));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setReviewsLoading(false));
    }
  };

export const approveReview =
  (review: Pick<Review, '_id'>): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      await axios.put(`${API_URL}/review/approve/${review._id}`);

      dispatch(fetchReviews());
    } catch (error) {
      handleError(error, dispatch);
    }
  };

export const rejectReview =
  (review: Pick<Review, '_id'>): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      await axios.put(`${API_URL}/review/reject/${review._id}`);

      dispatch(fetchReviews());
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// delete review api
export const deleteReview =
  (id: string): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/review/delete/${id}`
      );

      if (response.data.success == true) {
        notify.success(`${response.data.message}`);
        dispatch(removeReview(id));
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// fetch product reviews api (product page)
export const fetchProductReviews =
  (slug: string): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      const response = await axios.get<{ reviews: Review[] }>(
        `${API_URL}/review/${slug}`
      );

      dispatch(
        setProductReviews({
          reviews: response.data.reviews,
          reviewsSummary: getProductReviewsSummary(response.data.reviews)
        })
      );
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// add a review of the product page product api
export const addProductReview =
  (values: AddReviewValues): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    try {
      const product = getState().product.storeProduct;
      if (!product) return false;

      const isRecommended = Number(values.isRecommended);

      const newReview = {
        product: product._id,
        isRecommended,
        rating: values.rating,
        review: values.review,
        title: values.title
      };

      const sanitizedReview = sanitizeFields(newReview);

      const response = await axios.post<MessageResponse>(
        `${API_URL}/review/add`,
        {
          ...sanitizedReview,
          isRecommended
        }
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(fetchProductReviews(product.slug));
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
