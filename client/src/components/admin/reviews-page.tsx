'use client';

import { useCallback } from 'react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  approveReview,
  deleteReview,
  fetchReviews,
  rejectReview
} from '@/store/review/actions';

import { ResultCount } from './result-count';
import { ReviewCard } from './review-card';
import { useLoad } from './use-load';

export function ReviewsPage() {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(state => state.review.reviews);
  const isLoading = useAppSelector(state => state.review.isLoading);
  const { currentPage, totalPages, count } = useAppSelector(
    state => state.review.advancedFilters
  );

  const loaded = useLoad(
    useCallback(() => dispatch(fetchReviews()), [dispatch])
  );

  return (
    <SubPage title='Reviews' description='What shoppers wrote about products.'>
      {!loaded || (isLoading && reviews.length === 0) ? (
        <InlineLoader label='Loading reviews' />
      ) : reviews.length > 0 ? (
        <div className='space-y-4' aria-busy={isLoading}>
          <ResultCount count={count} singular='review' plural='reviews' />
          <ul className='divide-y border-y border-foreground'>
            {reviews.map(review => (
              <li key={review._id}>
                <ReviewCard
                  review={review}
                  onApprove={r => dispatch(approveReview(r))}
                  onReject={r => dispatch(rejectReview(r))}
                  onDelete={r => dispatch(deleteReview(r._id))}
                />
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <PaginationBar
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={page => dispatch(fetchReviews(page))}
            />
          )}
        </div>
      ) : (
        <EmptyState message='No reviews found.' />
      )}
    </SubPage>
  );
}
