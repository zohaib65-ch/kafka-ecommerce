'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';

import { ProductImage } from '@/components/shared/product-image';
import { StarRating } from '@/components/shared/star-rating';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { REVIEW_STATUS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import type { Review } from '@/types';

import { ConfirmAction } from './confirm-action';

type ReviewCardProps = {
  review: Review;
  onApprove: (review: Review) => void;
  onReject: (review: Review) => void;
  onDelete: (review: Review) => void;
};

/** One review as a ruled row: the text, the product it is about, and the moderation actions. */
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
        <Button variant='destructive' size='sm'>
          <Trash2 /> Delete
        </Button>
      }
    />
  );

  return (
    <article className='grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10'>
      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-2'>
          <h2 className='text-xl leading-tight font-semibold tracking-normal [overflow-wrap:anywhere] normal-case'>
            {review.title}
          </h2>
          <StatusBadge status={review.status} />
        </div>
        <p className='meta mt-2'>
          {author ? `${author} · ` : ''}
          {formatDate(review.created)}
        </p>
        <p className='mt-3 max-w-2xl leading-relaxed [overflow-wrap:anywhere] whitespace-pre-line'>
          {review.review}
        </p>

        <div className='mt-5 flex flex-wrap items-center gap-2'>
          {review.status === REVIEW_STATUS.Approved ? null : review.status ===
            REVIEW_STATUS.Rejected ? (
            <>
              <p className='mr-2 text-sm text-muted-foreground'>
                Rejected. Approve it again?
              </p>
              <Button size='sm' onClick={() => onApprove(review)}>
                Approve
              </Button>
            </>
          ) : (
            <>
              <Button size='sm' onClick={() => onApprove(review)}>
                Approve
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onReject(review)}
              >
                Reject
              </Button>
            </>
          )}
          {deleteButton}
        </div>
      </div>

      <div className='flex items-start gap-3 lg:border-l lg:pl-6'>
        {product ? (
          <>
            <ProductImage
              product={product}
              sizes='48px'
              className='size-12 shrink-0 border'
            />
            <div className='min-w-0'>
              <Link
                href={`/product/${product.slug}`}
                className='block truncate font-semibold underline-offset-4 hover:underline hover:decoration-brand hover:decoration-2'
              >
                {product.name}
              </Link>
              <StarRating value={review.rating} size={15} className='mt-1' />
            </div>
          </>
        ) : (
          <div className='min-w-0'>
            <p className='text-sm text-muted-foreground'>
              Product is not available.
            </p>
            <StarRating value={review.rating} size={15} className='mt-1' />
          </div>
        )}
      </div>
    </article>
  );
}
