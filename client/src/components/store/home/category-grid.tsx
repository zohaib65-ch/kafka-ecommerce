'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { categoryImageFor } from '@/lib/site-images';
import { useAppSelector } from '@/store/hooks';

import { SectionHeading } from './section-heading';

const MAX_CATEGORIES = 8;

/** "Shop by category" tiles. Hidden until the store has categories. */
export function CategoryGrid() {
  const categories = useAppSelector(state => state.category.storeCategories);

  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby='home-categories'
      className='container-page mt-16 lg:mt-24'
    >
      <SectionHeading
        id='home-categories'
        eyebrow='Browse'
        title='Shop by category'
        href='/shop'
        linkLabel='All products'
      />
      <ul className='mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
        {categories.slice(0, MAX_CATEGORIES).map(category => {
          const image = categoryImageFor(category.name);
          return (
            <li key={category._id}>
              <Link
                href={`/shop/category/${category.slug}`}
                className='group relative block aspect-[4/3] overflow-hidden rounded-2xl border focus-visible:ring-3 focus-visible:ring-ring/60 focus-visible:outline-none'
              >
                <Image
                  src={image.src}
                  alt=''
                  fill
                  sizes='(min-width: 1024px) 25vw, 50vw'
                  className='object-cover transition-transform duration-500 group-hover:scale-105'
                />
                <span
                  aria-hidden='true'
                  className='absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent'
                />
                <span className='absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-ink-foreground'>
                  <span className='line-clamp-2 font-heading text-base font-semibold sm:text-lg'>
                    {category.name}
                  </span>
                  <ArrowUpRight
                    className='size-5 shrink-0 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    aria-hidden='true'
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
