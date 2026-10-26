'use client';

import Link from 'next/link';
import { Check, RefreshCw, Trash2, X } from 'lucide-react';

import { ProductImage } from '@/components/shared/product-image';
import { StarRating } from '@/components/shared/star-rating';
import { StatusBadge } from '@/components/shared/status-badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { REVIEW_STATUS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import { getAvatarColor, getInitials } from '@/lib/utils';
import type { Review } from '@/types';

import { ConfirmAction } from './confirm-action';

type ReviewCardProps = {
  review: Review;
  onApprove: (review: Review) => void;
  onReject: (review: Review) => void;
  onDelete: (review: Review) => void;
};

export function ReviewCard({
  review,
  onApprove,
  onReject,
  onDelete
}: ReviewCardProps) {
  const product =
    review.product && typeof review.product === 'object'
      ? review.product
      : null;
  const author = review.user?.firstName;

  const deleteButton = (
    <ConfirmAction
      title='Delete this review?'
      description='The review is removed for good and cannot be restored.'
      confirmLabel='Delete review'
      onConfirm={() => onDelete(review)}
      trigger={
        <Button
          variant='outline'
          size='sm'
          className='text-destructive hover:text-destructive'
        >
          <Trash2 /> Delete
        </Button>
      }
    />
  );

  return (
    <article className='space-y-4 rounded-2xl border bg-card p-5'>
      <div className='flex items-start gap-4'>
        {author && (
          <Avatar className='size-10 shrink-0'>
            <AvatarFallback
              className='font-semibold text-white'
              style={{
                backgroundColor: getAvatarColor(review.user?._id ?? author)
              }}
            >
              {getInitials(author)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-start justify-between gap-x-3 gap-y-1'>
            <h2 className='min-w-0 text-base leading-snug font-semibold break-words'>
              {review.title}
            </h2>
            <StatusBadge status={review.status} />
          </div>
          <p className='mt-1 text-xs text-muted-foreground'>
            {author ? `${author} · ` : ''}
            Review added on {formatDate(review.created)}
          </p>
          <p className='mt-3 text-sm leading-relaxed break-words whitespace-pre-line'>
            {review.review}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-3 rounded-xl bg-muted/50 p-3'>
        {product ? (
          <>
            <ProductImage
              product={product}
              sizes='56px'
              className='size-14 shrink-0 rounded-lg border'
            />
            <div className='min-w-0'>
              <Link
                href={`/product/${product.slug}`}
                className='block truncate text-sm font-medium text-primary hover:underline'
              >
                {product.name}
              </Link>
              <StarRating value={review.rating} size={16} className='mt-1' />
            </div>
          </>
        ) : (
          <div className='min-w-0'>
            <p className='text-sm text-muted-foreground'>
              Product is not available.
            </p>
            <StarRating value={review.rating} size={16} className='mt-1' />
          </div>
        )}
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3 border-t pt-4'>
        {review.status === REVIEW_STATUS.Approved ? (
          <p className='flex items-center gap-2 text-sm font-medium text-success'>
            <Check className='size-4' aria-hidden='true' /> Approved
          </p>
        ) : review.status === REVIEW_STATUS.Rejected ? (
          <div className='flex items-center gap-3'>
            <p className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
              <RefreshCw className='size-4' aria-hidden='true' /> Re approve
              review
            </p>
            <Button size='sm' onClick={() => onApprove(review)}>
              <Check /> Approve
            </Button>
          </div>
        ) : (
          <div className='flex gap-2'>
            <Button size='sm' onClick={() => onApprove(review)}>
              <Check /> Approve
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => onReject(review)}
            >
              <X /> Reject
            </Button>
          </div>
        )}
        {deleteButton}
      </div>
    </article>
  );
}
