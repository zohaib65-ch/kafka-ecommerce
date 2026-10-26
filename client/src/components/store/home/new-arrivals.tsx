'use client';

import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  filterProducts,
  resetAdvancedFilters,
  setAdvancedFilters
} from '@/store/product/actions';

import { ProductGrid, ProductGridSkeleton } from '../product-grid';
import { SectionHeading } from './section-heading';

const COUNT = 8;
const gridClass = 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4';

/** The newest products (first page of the shop, newest first). Hidden when there are none. */
export function NewArrivals() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.product.storeProducts);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Start from the unfiltered, newest-first listing, whatever the shop was left on.
    dispatch(resetAdvancedFilters());
    dispatch(setAdvancedFilters({ limit: COUNT }));
    dispatch(filterProducts()).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (ready && products.length === 0) return null;

  return (
    <section
      aria-labelledby='home-new-arrivals'
      className='container-page mt-16 lg:mt-24'
    >
      <SectionHeading
        id='home-new-arrivals'
        eyebrow='Just in'
        title='New arrivals'
        href='/shop'
        linkLabel='Shop all'
      />
      <div className='mt-8'>
        {ready ? (
          <ProductGrid
            products={products.slice(0, COUNT)}
            columnsClassName={gridClass}
          />
        ) : (
          <ProductGridSkeleton count={COUNT} columnsClassName={gridClass} />
        )}
      </div>
    </section>
  );
}
