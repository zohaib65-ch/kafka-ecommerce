'use client';

import { useState } from 'react';
import { ThumbsUp } from 'lucide-react';

import { StarRating } from '@/components/shared/star-rating';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { cn, getAvatarColor, getInitials } from '@/lib/utils';
import type { Review } from '@/types';

const COLLAPSE_AT = 180;

function ReviewItem({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const name = review.user?.firstName ?? '';
  const long = review.review.length > COLLAPSE_AT;

  return (
    <li className='flex gap-4 rounded-2xl border bg-card p-5 shadow-soft'>
      <Avatar className='size-11 shrink-0'>
        <AvatarFallback
          className='font-semibold text-white'
          style={{ backgroundColor: getAvatarColor(name || review._id) }}
        >
          {getInitials(name) || '•'}
        </AvatarFallback>
      </Avatar>

      <div className='min-w-0 flex-1 space-y-2'>
        <div className='flex flex-wrap items-start justify-between gap-x-4 gap-y-1'>
          <h3 className='min-w-0 truncate text-base font-semibold'>
            {review.title}
          </h3>
          <StarRating value={review.rating} size={16} />
        </div>
        <p className='text-xs text-muted-foreground'>
          {name && (
            <span className='font-medium text-foreground'>{name} · </span>
          )}
          {formatDate(review.created)}
        </p>
        <p
          className={cn(
            'text-sm leading-relaxed break-words',
            !expanded && 'line-clamp-3'
          )}
        >
          {review.review}
        </p>
        <div className='flex flex-wrap items-center gap-3'>
          {long && (
            <button
              type='button'
              onClick={() => setExpanded(value => !value)}
              aria-expanded={expanded}
              className='text-sm font-medium text-primary hover:underline'
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
          {review.isRecommended && (
            <Badge variant='secondary' className='bg-success/15 text-success'>
              <ThumbsUp /> Recommended
            </Badge>
          )}
        </div>
      </div>
    </li>
  );
}

export function ReviewList({ reviews }: { reviews: Review[] }) {
  return (
    <ul className='space-y-4'>
      {reviews.map(review => (
        <ReviewItem key={review._id} review={review} />
      ))}
    </ul>
  );
}
