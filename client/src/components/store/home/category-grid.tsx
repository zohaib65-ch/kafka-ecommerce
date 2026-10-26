'use client';

import Image from 'next/image';
import Link from 'next/link';

import { categoryImageFor } from '@/lib/site-images';
import { useAppSelector } from '@/store/hooks';

import { SectionHeading } from './section-heading';

const MAX_CATEGORIES = 8;

/** "Shop by category": a photo index with the name under each picture. Hidden until the store has categories. */
export function CategoryGrid() {
  const categories = useAppSelector(state => state.category.storeCategories);

  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby='home-categories'
      className='container-page mt-20 lg:mt-28'
    >
      <SectionHeading
        id='home-categories'
        title='Shop by category'
        href='/shop'
        linkLabel='All products'
      />
      <ul className='mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4'>
        {categories.slice(0, MAX_CATEGORIES).map(category => {
          const image = categoryImageFor(category.name);
          return (
            <li key={category._id}>
              <Link
                href={`/shop/category/${category.slug}`}
                className='group block'
              >
                <span className='relative block aspect-square overflow-hidden border bg-muted'>
                  <Image
                    src={image.src}
                    alt=''
                    fill
                    sizes='(min-width: 768px) 25vw, 50vw'
                    className='object-cover'
                  />
                </span>
                <span className='mt-3 block font-heading text-2xl leading-none font-semibold underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-brand'>
                  {category.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
