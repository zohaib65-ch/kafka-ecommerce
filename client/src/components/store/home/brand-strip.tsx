'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { useAppSelector } from '@/store/hooks';

import { SectionHeading } from './section-heading';

// Ten cells fill whole rows at both grid widths (2 and 5 columns).
const MAX_BRANDS = 10;

/** Brands as a ruled grid of name cells. Hidden until the store has brands. */
export function BrandStrip() {
  const brands = useAppSelector(state => state.brand.storeBrands);

  if (brands.length === 0) return null;

  return (
    <section
      aria-labelledby='home-brands'
      className='container-page mt-20 lg:mt-28'
    >
      <SectionHeading
        id='home-brands'
        title='Shop by brand'
        href='/brands'
        linkLabel='See all brands'
      />
      <ul className='mt-8 grid grid-cols-2 border-t border-l lg:grid-cols-5'>
        {brands.slice(0, MAX_BRANDS).map(brand => (
          <li key={brand._id} className='border-r border-b'>
            <Link
              href={`/shop/brand/${brand.slug}`}
              className='group flex h-full min-h-36 flex-col justify-between gap-6 p-4 transition-colors hover:bg-primary hover:text-primary-foreground sm:p-5'
            >
              <span className='font-heading text-2xl leading-[1.05] font-semibold text-balance'>
                {brand.name}
              </span>
              <ArrowUpRight
                className='size-5 self-end transition-colors group-hover:text-brand'
                aria-hidden='true'
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
