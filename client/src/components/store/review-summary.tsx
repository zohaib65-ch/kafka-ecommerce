import { StarRating } from '@/components/shared/star-rating';
import type { ReviewSummary as ReviewSummaryData } from '@/types';

const percentage = (part: number, total: number) =>
  total > 0 ? parseFloat(((100 * part) / total).toFixed(2)) : 0;

/** Average rating and the per-star distribution of the product reviews. */
export function ReviewSummary({ summary }: { summary: ReviewSummaryData }) {
  const { ratingSummary, totalRatings, totalReviews, totalSummary } = summary;
  const average = totalReviews > 0 ? totalRatings / totalReviews : 0;

  return (
    <div>
      <h3 className='meta border-b pb-2'>Rating</h3>

      {totalReviews > 0 ? (
        <>
          <div className='mt-4 flex items-end gap-4'>
            <span className='tabular font-heading text-8xl leading-[0.8] font-semibold'>
              {average.toFixed(1)}
            </span>
            <div className='space-y-1 pb-1'>
              <StarRating value={average} size={18} />
              <p className='text-sm text-muted-foreground'>
                based on {totalReviews}{' '}
                {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>

          <ul className='mt-6 space-y-2.5'>
            {ratingSummary.map(bucket => {
              const stars = Number(Object.keys(bucket)[0]);
              const percent = percentage(bucket[stars], totalSummary);
              return (
                <li key={stars} className='flex items-center gap-3 text-sm'>
                  <span className='w-12 shrink-0'>{stars} star</span>
                  <div
                    className='h-2 flex-1 bg-muted'
                    role='img'
                    aria-label={`${percent}% of reviews are ${stars} star`}
                  >
                    <div
                      className='h-full bg-foreground'
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className='tabular w-12 shrink-0 text-right font-semibold'>
                    {percent}%
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className='mt-4 text-muted-foreground'>
          No reviews yet. Be the first to add one.
        </p>
      )}
    </div>
  );
}
