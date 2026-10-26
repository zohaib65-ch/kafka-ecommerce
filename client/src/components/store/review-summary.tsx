import { MessageSquareText } from 'lucide-react';

import { StarRating } from '@/components/shared/star-rating';
import type { ReviewSummary as ReviewSummaryData } from '@/types';

const percentage = (part: number, total: number) =>
  total > 0 ? parseFloat(((100 * part) / total).toFixed(2)) : 0;

/** Average rating and the per-star distribution of the product reviews. */
export function ReviewSummary({ summary }: { summary: ReviewSummaryData }) {
  const { ratingSummary, totalRatings, totalReviews, totalSummary } = summary;
  const average = totalReviews > 0 ? totalRatings / totalReviews : 0;

  return (
    <div className='rounded-2xl border bg-card p-6 shadow-soft'>
      <h2 className='text-xl font-semibold'>Rating</h2>

      {totalReviews > 0 ? (
        <>
          <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2'>
            <span className='font-heading text-5xl leading-none font-semibold'>
              {average.toFixed(1)}
            </span>
            <div className='space-y-1'>
              <StarRating value={average} size={20} />
              <p className='text-sm text-muted-foreground'>
                based on {totalReviews}{' '}
                {totalReviews === 1 ? 'review' : 'reviews'}.
              </p>
            </div>
          </div>

          <ul className='mt-6 space-y-3'>
            {ratingSummary.map(bucket => {
              const stars = Number(Object.keys(bucket)[0]);
              const percent = percentage(bucket[stars], totalSummary);
              return (
                <li key={stars} className='flex items-center gap-3 text-sm'>
                  <span className='w-12 shrink-0'>{stars} star</span>
                  <div
                    className='h-2.5 flex-1 overflow-hidden rounded-full bg-muted'
                    role='img'
                    aria-label={`${percent}% of reviews are ${stars} star`}
                  >
                    <div
                      className='h-full rounded-full bg-star transition-all'
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className='w-12 shrink-0 text-right font-medium tabular-nums'>
                    {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className='flex flex-col items-center gap-2 py-8 text-center text-muted-foreground'>
          <span className='grid size-14 place-items-center rounded-full bg-muted'>
            <MessageSquareText className='size-6' aria-hidden='true' />
          </span>
          <p className='text-sm'>Be the first to add a review.</p>
        </div>
      )}
    </div>
  );
}
