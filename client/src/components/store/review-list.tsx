'use client';

import { useState } from 'react';

import { StarRating } from '@/components/shared/star-rating';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Review } from '@/types';

const COLLAPSE_AT = 180;

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const name = review.user?.firstName ?? '';
  const long = review.review.length > COLLAPSE_AT;

  return (
    <li className='space-y-2 border-b py-6 first:pt-0'>
      <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1'>
        <h4 className='min-w-0 text-lg font-semibold'>{review.title}</h4>
        <StarRating value={review.rating} size={16} />
      </div>
      <p className='meta'>
        {name && <span className='text-foreground'>{name} · </span>}
        {formatDate(review.created)}
      </p>
      <p
        className={cn(
          'leading-relaxed break-words',
          !expanded && 'line-clamp-3'
        )}
      >
        {review.review}
      </p>
      <div className='flex flex-wrap items-center gap-4'>
        {long && (
          <button
            type='button'
            onClick={() => setExpanded(value => !value)}
            aria-expanded={expanded}
            className='text-sm font-semibold underline decoration-brand decoration-2 underline-offset-4'
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        {review.isRecommended && <Badge variant='outline'>Recommended</Badge>}
      </div>
    </li>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className='border-t border-foreground pt-6'>
      {reviews.map(review => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </ul>
  );
}
