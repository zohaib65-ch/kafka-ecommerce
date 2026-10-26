'use client';

import Link from 'next/link';

import { useAppSelector } from '@/store/hooks';

import { SectionHeading } from './section-heading';

const MAX_BRANDS = 12;

/** Brand names set as one running line of links. Hidden until the store has brands. */
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
      <ul className='mt-8 flex flex-wrap gap-x-5 gap-y-1'>
        {brands.slice(0, MAX_BRANDS).map(brand => (
          <li
            key={brand._id}
            className="font-heading text-3xl leading-tight font-semibold after:ml-5 after:text-brand after:content-['/'] last:after:hidden sm:text-4xl"
          >
            <Link
              href={`/shop/brand/${brand.slug}`}
              className='underline decoration-transparent decoration-2 underline-offset-4 hover:decoration-brand'
            >
              {brand.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
