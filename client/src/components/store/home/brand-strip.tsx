'use client';

import Link from 'next/link';

import { useAppSelector } from '@/store/hooks';

import { BrandMonogram } from '../brand-monogram';
import { SectionHeading } from './section-heading';

const MAX_BRANDS = 12;

/** Horizontally scrolling row of brands. Hidden until the store has brands. */
export function BrandStrip() {
  const brands = useAppSelector(state => state.brand.storeBrands);

  if (brands.length === 0) return null;

  return (
    <section
      aria-labelledby='home-brands'
      className='container-page mt-16 lg:mt-24'
    >
      <SectionHeading
        id='home-brands'
        eyebrow='Brands'
        title='Shop by brand'
        href='/brands'
        linkLabel='See all brands'
      />
      <ul className='-mx-4 mt-8 flex snap-x scrollbar-thin gap-3 overflow-x-auto [mask-image:linear-gradient(to_right,black_calc(100%-3rem),transparent)] px-4 pb-3 sm:mx-0 sm:px-0'>
        {brands.slice(0, MAX_BRANDS).map(brand => (
          <li key={brand._id} className='shrink-0 snap-start'>
            <Link
              href={`/shop/brand/${brand.slug}`}
              className='flex w-64 items-center gap-3 rounded-2xl border bg-card p-4 shadow-soft transition-shadow hover:shadow-lift focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none'
            >
              <BrandMonogram name={brand.name} className='size-11 text-lg' />
              <span className='min-w-0'>
                <span className='line-clamp-1 font-medium'>{brand.name}</span>
                <span className='line-clamp-1 text-xs text-muted-foreground'>
                  {brand.description}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
