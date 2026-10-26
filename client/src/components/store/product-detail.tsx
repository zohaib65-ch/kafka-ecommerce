'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PackageX, Tag, Truck } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';
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
    <div className='grid gap-8 lg:grid-cols-2 lg:gap-14' aria-hidden='true'>
      <Skeleton className='aspect-square w-full rounded-3xl' />
      <div className='space-y-4'>
        <Skeleton className='h-4 w-40' />
        <Skeleton className='h-10 w-4/5' />
        <Skeleton className='h-4 w-28' />
        <Skeleton className='h-9 w-32' />
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
      <Breadcrumb className='mb-6'>
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
          icon={PackageX}
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
          <div className='grid gap-8 lg:grid-cols-2 lg:gap-14'>
            <div className='relative'>
              <ProductImage
                product={current}
                priority
                sizes='(min-width: 1024px) 560px, 100vw'
                className='rounded-3xl border shadow-soft'
              />
              <Badge
                className={cn(
                  'absolute top-4 left-4 h-7 px-3 text-xs shadow-sm',
                  outOfStock
                    ? 'bg-destructive text-white'
                    : 'bg-success text-success-foreground'
                )}
              >
                {outOfStock ? 'Out of stock' : 'In stock'}
              </Badge>
            </div>

            <div className='space-y-6'>
              <div className='space-y-3'>
                {current.brand?.slug && (
                  <p className='flex items-center gap-1.5 text-sm text-muted-foreground'>
                    <Tag className='size-3.5' aria-hidden='true' />
                    see more from{' '}
                    <Link
                      href={`/shop/brand/${current.brand.slug}`}
                      className='font-medium text-primary hover:underline'
                    >
                      {current.brand.name}
                    </Link>
                  </p>
                )}
                <h1 className='text-3xl font-semibold sm:text-4xl'>
                  {current.name}
                </h1>
                <p className='font-mono text-sm text-muted-foreground'>
                  {current.sku}
                </p>
                {summary.totalReviews > 0 && (
                  <a
                    href='#reviews'
                    className='inline-flex items-center gap-2 text-sm hover:underline'
                  >
                    <StarRating value={average} size={18} />
                    <span className='font-medium'>{average.toFixed(1)}</span>
                    <span className='text-muted-foreground'>
                      ({summary.totalReviews}{' '}
                      {summary.totalReviews === 1 ? 'review' : 'reviews'})
                    </span>
                  </a>
                )}
              </div>

              <p className='font-heading text-4xl font-semibold'>
                {formatPrice(current.price)}
              </p>

              <p className='leading-relaxed text-pretty text-muted-foreground'>
                {current.description}
              </p>

              <Separator />

              <PurchaseForm key={current._id} product={current} />

              <Separator />

              <div className='space-y-4'>
                <ShareButtons product={current} />
                <p className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Truck className='size-4 text-primary' aria-hidden='true' />
                  Free shipping on every order
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
