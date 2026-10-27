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

/** A flat grid cell: photo, brand, name and price. The grid draws the rules between cells. */
export function ProductCard({
  product,
  priority,
  className
}: ProductCardProps) {
  const reviewCount = product.totalReviews ?? 0;

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col bg-background p-3 transition-colors hover:bg-card sm:p-4',
        className
      )}
    >
      <div className='relative'>
        <ProductImage
          product={product}
          priority={priority}
          sizes='(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw'
          className='border'
        />
        <WishlistButton
          productId={product._id}
          productName={product.name}
          liked={product.isLiked ?? false}
          className='absolute top-2 right-2 z-10'
        />
      </div>

      <div className='mt-3 flex flex-1 flex-col gap-1'>
        {product.brand?.name && (
          <p className='line-clamp-1 text-xs text-muted-foreground'>
            {product.brand.name}
          </p>
        )}
        <h3 className='text-base leading-snug'>
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackProductClick(product)}
            className='underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-brand after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-ring'
          >
            <span className='line-clamp-2'>{product.name}</span>
          </Link>
        </h3>

        <div className='mt-auto flex items-end justify-between gap-2 pt-2'>
          <p className='tabular font-heading text-2xl leading-none font-semibold'>
            {formatPrice(product.price)}
          </p>
          {reviewCount > 0 && (
            <p
              className='tabular flex items-center gap-1 text-sm font-semibold'
              aria-label={`Rated ${Number(product.averageRating ?? 0).toFixed(1)} out of 5 from ${reviewCount} reviews`}
            >
              <Star
                className='size-3.5 fill-star text-star'
                aria-hidden='true'
              />
              {Number(product.averageRating ?? 0).toFixed(1)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
