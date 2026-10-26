'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Tag } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStoreBrands } from '@/store/brand/actions';

import { BrandMonogram } from './brand-monogram';

/** "Shop By Brand": every active brand with a link to its products. */
export function BrandsGrid() {
  const dispatch = useAppDispatch();
  const brands = useAppSelector(state => state.brand.storeBrands);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dispatch(fetchStoreBrands()).then(() => {
      if (!cancelled) setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <div className='container-page py-10 lg:py-14'>
      <PageHeader
        eyebrow='Brands'
        title='Shop By Brand'
        description='Explore products from every brand in the store.'
      />

      {brands.length > 0 ? (
        <ul className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {brands.map(brand => (
            <li key={brand._id}>
              <Link
                href={`/shop/brand/${brand.slug}`}
                className='group flex h-full flex-col gap-4 rounded-2xl border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none'
              >
                <div className='flex items-start justify-between gap-3'>
                  <BrandMonogram name={brand.name} />
                  <ArrowUpRight
                    className='size-5 text-muted-foreground transition-colors group-hover:text-primary'
                    aria-hidden='true'
                  />
                </div>
                <div className='space-y-1.5'>
                  <h2 className='text-lg leading-snug font-semibold'>
                    {brand.name}
                  </h2>
                  <p className='line-clamp-3 text-sm text-muted-foreground'>
                    {brand.description}
                  </p>
                </div>
                <span className='mt-auto pt-2 text-sm font-medium text-primary'>
                  Shop {brand.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : loaded ? (
        <EmptyState
          className='mt-10'
          icon={Tag}
          title='No brands found.'
          action={
            <Button asChild variant='outline'>
              <Link href='/shop'>Browse all products</Link>
            </Button>
          }
        />
      ) : (
        <BrandsPlaceholder />
      )}
    </div>
  );
}

// Shown until the first response arrives.
function BrandsPlaceholder() {
  return (
    <>
      <ul
        className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        aria-hidden='true'
      >
        {Array.from({ length: 8 }, (_, index) => (
          <li key={index}>
            <Skeleton className='h-44 rounded-2xl' />
          </li>
        ))}
      </ul>
      <span className='sr-only'>Loading brands</span>
    </>
  );
}
