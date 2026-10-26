'use client';

import { useAppSelector } from '@/store/hooks';

import { ReviewForm } from './review-form';
import { ReviewList } from './review-list';
import { ReviewSummary } from './review-summary';

export function ProductReviews() {
  const reviews = useAppSelector(state => state.review.productReviews);
  const summary = useAppSelector(state => state.review.reviewsSummary);

  return (
    <section
      id='reviews'
      aria-labelledby='reviews-title'
      className='mt-16 scroll-mt-28 lg:mt-24'
    >
      <h2 id='reviews-title' className='text-2xl font-semibold sm:text-3xl'>
        Customer reviews
      </h2>
      <div className='mt-8 grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-start'>
        <div className='lg:sticky lg:top-28'>
          <ReviewSummary summary={summary} />
        </div>
        <div className='space-y-6'>
          {reviews.length > 0 && <ReviewList reviews={reviews} />}
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
