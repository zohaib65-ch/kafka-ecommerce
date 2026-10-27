'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { EmptyState } from '@/components/shared/empty-state';
import { ProductImage } from '@/components/shared/product-image';
import { StarRating } from '@/components/shared/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStoreProduct } from '@/store/product/actions';
import { fetchProductReviews } from '@/store/review/actions';

import { ProductReviews } from './product-reviews';
import { PurchaseForm } from './purchase-form';
import { ShareButtons } from './share-buttons';

function ProductDetailSkeleton() {
  return (
    <div className='grid gap-8 lg:grid-cols-12 lg:gap-12' aria-hidden='true'>
      <Skeleton className='aspect-square w-full lg:col-span-7' />
      <div className='space-y-4 lg:col-span-5'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-14 w-4/5' />
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-14 w-32' />
        <Skeleton className='h-24 w-full' />
        <Skeleton className='h-12 w-64' />
      </div>
    </div>
  );
}

/** Product page: details, purchase form, share links and reviews. */
export function ProductDetail({ slug }: { slug: string }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.product.storeProduct);
  const summary = useAppSelector(state => state.review.reviewsSummary);
  // The slug whose product + reviews were last loaded: anything else is stale or still loading.
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      dispatch(fetchStoreProduct(slug)),
      dispatch(fetchProductReviews(slug))
    ]).then(() => {
      if (!cancelled) setLoadedSlug(slug);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, slug]);

  const ready = loadedSlug === slug;
  const current = ready ? product : null;
  const outOfStock = !!current && current.inventory <= 0;
  const average =
    summary.totalReviews > 0 ? summary.totalRatings / summary.totalReviews : 0;

  return (
    <div className='container-page py-8 lg:py-12'>
      <Breadcrumb className='mb-8'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/shop'>Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {current && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className='line-clamp-1'>
                  {current.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {!ready ? (
        <ProductDetailSkeleton />
      ) : !current ? (
        <EmptyState
          title='No product found.'
          description='This product may have been removed or is no longer available.'
          action={
            <Button asChild>
              <Link href='/shop'>Browse the shop</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className='grid gap-8 lg:grid-cols-12 lg:gap-12'>
            <div className='relative lg:col-span-7'>
              <ProductImage
                product={current}
                priority
                sizes='(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw'
                className='border border-foreground'
              />
              <Badge
                className={cn(
                  'absolute top-3 left-3 h-6 px-2',
                  outOfStock
                    ? 'bg-destructive text-white'
                    : 'bg-success text-success-foreground'
                )}
              >
                {outOfStock ? 'Out of stock' : 'In stock'}
              </Badge>
            </div>

            <div className='lg:col-span-5'>
              {current.brand?.slug && (
                <p className='text-sm text-muted-foreground'>
                  See more from{' '}
                  <Link
                    href={`/shop/brand/${current.brand.slug}`}
                    className='font-semibold text-foreground underline decoration-brand decoration-2 underline-offset-4 hover:decoration-4'
                  >
                    {current.brand.name}
                  </Link>
                </p>
              )}
              <h1 className='mt-3 text-5xl sm:text-6xl'>{current.name}</h1>
              <p className='meta mt-3'>SKU {current.sku}</p>
              {summary.totalReviews > 0 && (
                <a
                  href='#reviews'
                  className='mt-4 inline-flex items-center gap-2 text-sm hover:underline'
                >
                  <StarRating value={average} size={18} />
                  <span className='tabular font-semibold'>
                    {average.toFixed(1)}
                  </span>
                  <span className='text-muted-foreground'>
                    ({summary.totalReviews}{' '}
                    {summary.totalReviews === 1 ? 'review' : 'reviews'})
                  </span>
                </a>
              )}

              <p className='tabular mt-6 font-heading text-7xl leading-none font-semibold'>
                {formatPrice(current.price)}
              </p>

              <p className='mt-6 max-w-prose leading-relaxed text-pretty'>
                {current.description}
              </p>

              <div className='mt-8 border-t border-foreground pt-6'>
                <PurchaseForm key={current._id} product={current} />
              </div>

              <div className='mt-8 space-y-4 border-t pt-6'>
                <ShareButtons product={current} />
                <p className='text-sm text-muted-foreground'>
                  Free shipping on every order.
                </p>
              </div>
            </div>
          </div>

          <ProductReviews />
        </>
      )}
    </div>
  );
}
