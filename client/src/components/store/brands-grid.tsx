'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStoreBrands } from '@/store/brand/actions';
import type { Brand } from '@/types';

type BrandGroup = { letter: string; brands: Brand[] };

// A–Z index: brands grouped under the first letter of their name.
const groupByLetter = (brands: Brand[]): BrandGroup[] => {
  const groups = new Map<string, Brand[]>();
  [...brands]
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach(brand => {
      const first = brand.name.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(first) ? first : '#';
      groups.set(letter, [...(groups.get(letter) ?? []), brand]);
    });
  return [...groups].map(([letter, items]) => ({ letter, brands: items }));
};

/** "Shop By Brand": every active brand in an A–Z index with a link to its products. */
export function BrandsGrid() {
  const dispatch = useAppDispatch();
  const brands = useAppSelector(state => state.brand.storeBrands);
  const [loaded, setLoaded] = useState(false);
  const groups = useMemo(() => groupByLetter(brands), [brands]);

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
        title='Shop By Brand'
        description='Every brand in the store, A to Z.'
      />

      {groups.length > 0 ? (
        <div className='mt-10 border-t border-foreground'>
          {groups.map(group => (
            <section
              key={group.letter}
              aria-label={`Brands starting with ${group.letter}`}
              className='grid gap-x-8 border-b md:grid-cols-[7rem_minmax(0,1fr)]'
            >
              <p
                aria-hidden='true'
                className='pt-5 font-heading text-6xl leading-none font-semibold text-muted-foreground md:py-5'
              >
                {group.letter}
              </p>
              <ul>
                {group.brands.map(brand => (
                  <li key={brand._id} className='border-t first:border-t-0'>
                    <Link
                      href={`/shop/brand/${brand.slug}`}
                      className='group grid items-baseline gap-x-8 gap-y-1 py-5 sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto]'
                    >
                      <span className='font-heading text-4xl leading-none font-semibold underline decoration-transparent decoration-4 underline-offset-8 group-hover:decoration-brand sm:text-5xl'>
                        {brand.name}
                      </span>
                      <span className='line-clamp-2 text-muted-foreground'>
                        {brand.description}
                      </span>
                      <span className='hidden items-center gap-1.5 text-sm font-semibold sm:inline-flex'>
                        View products
                        <ArrowRight className='size-4' aria-hidden='true' />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : loaded ? (
        <EmptyState
          className='mt-10'
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
      <ul className='mt-10 border-t border-foreground' aria-hidden='true'>
        {Array.from({ length: 6 }, (_, index) => (
          <li key={index} className='border-b py-5'>
            <Skeleton className='h-10 w-2/3' />
          </li>
        ))}
      </ul>
      <span className='sr-only'>Loading brands</span>
    </>
  );
}
