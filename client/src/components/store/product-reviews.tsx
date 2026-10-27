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
      className='mt-20 scroll-mt-28 lg:mt-28'
    >
      <div className='section-rule pt-4'>
        <h2 id='reviews-title' className='text-4xl sm:text-5xl'>
          Customer reviews
        </h2>
      </div>
      <div className='mt-8 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12'>
        <div className='lg:sticky lg:top-24 lg:col-span-4'>
          <ReviewSummary summary={summary} />
        </div>
        <div className='space-y-10 lg:col-span-8'>
          {reviews.length > 0 && <ReviewList reviews={reviews} />}
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
