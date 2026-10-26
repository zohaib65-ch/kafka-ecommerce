'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

import { ProductImage } from '@/components/shared/product-image';
import { trackProductClick } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { StoreListProduct } from '@/types';

import { WishlistButton } from './wishlist-button';

type ProductCardProps = {
  product: StoreListProduct;
  /** Marks the first row of images as high priority (above the fold). */
  priority?: boolean;
  className?: string;
};

export function ProductCard({
  product,
  priority,
  className
}: ProductCardProps) {
  const hasBrand = !!product.brand?.name;
  const reviewCount = product.totalReviews ?? 0;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-shadow duration-300 hover:shadow-lift',
        className
      )}
    >
      <div className='relative'>
        <ProductImage
          product={product}
          priority={priority}
          sizes='(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw'
          imageClassName='transition-transform duration-500 group-hover:scale-105'
        />
        <WishlistButton
          productId={product._id}
          productName={product.name}
          liked={product.isLiked ?? false}
          className='absolute top-2.5 right-2.5 z-10'
        />
      </div>

      <div className='flex flex-1 flex-col gap-1 p-3.5 sm:p-4'>
        {hasBrand && (
          <p className='line-clamp-1 text-xs text-muted-foreground'>
            By{' '}
            <span className='font-medium text-primary'>
              {product.brand?.name}
            </span>
          </p>
        )}
        <h3 className='font-heading text-sm leading-snug font-semibold sm:text-base'>
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackProductClick(product)}
            className='after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-3 focus-visible:after:ring-ring/60'
          >
            <span className='line-clamp-2'>{product.name}</span>
          </Link>
        </h3>
        <p className='line-clamp-2 text-xs text-muted-foreground sm:text-sm'>
          {product.description}
        </p>

        <div className='mt-auto flex items-end justify-between gap-2 pt-3'>
          <p className='text-base font-semibold sm:text-lg'>
            {formatPrice(product.price)}
          </p>
          {reviewCount > 0 && (
            <p
              className='flex items-center gap-1 text-sm font-medium'
              aria-label={`Rated ${Number(product.averageRating ?? 0).toFixed(1)} out of 5 from ${reviewCount} reviews`}
            >
              <Star className='size-4 fill-star text-star' aria-hidden='true' />
              {Number(product.averageRating ?? 0).toFixed(1)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
