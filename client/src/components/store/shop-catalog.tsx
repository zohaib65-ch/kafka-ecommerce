'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { PaginationBar } from '@/components/shared/pagination-bar';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { sortOptions } from '@/lib/store-utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { filterProducts, setAdvancedFilters } from '@/store/product/actions';

import { ProductGrid, ProductGridSkeleton } from './product-grid';
import { ShopFilters } from './shop-filters';

/** Products per page in the shop (a multiple of 2, 3 and 4 so the grid rows are always full). */
const PAGE_SIZE = 12;

type ShopCatalogProps = {
  /** Which products to list: everything, one category or one brand. */
  scope?: 'category' | 'brand';
  slug?: string;
};

const prettifySlug = (slug: string) =>
  slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * The shop: filters, sort, product grid and pagination. Shared by /shop, /shop/category/[slug]
 * and /shop/brand/[slug]; the data flow stays in Redux (`filterProducts`).
 */
export function ShopCatalog({ scope, slug }: ShopCatalogProps) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.product.storeProducts);
  const isLoading = useAppSelector(state => state.product.isLoading);
  const filters = useAppSelector(state => state.product.advancedFilters);
  const categories = useAppSelector(state => state.category.storeCategories);
  const brands = useAppSelector(state => state.brand.storeBrands);

  const [fetched, setFetched] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    dispatch(setAdvancedFilters({ limit: PAGE_SIZE }));
    const request =
      scope === 'category'
        ? filterProducts('category', slug)
        : scope === 'brand'
          ? filterProducts('brand', slug)
          : filterProducts();

    dispatch(request).then(() => {
      if (!cancelled) setFetched(true);
    });

    return () => {
      cancelled = true;
    };
  }, [dispatch, scope, slug]);

  const { totalPages, currentPage, count, limit, order } = filters;
  const totalProducts = products.length;
  const left = limit * (currentPage - 1) + 1;
  const right = totalProducts + left - 1;
  const showSkeleton = isLoading || !fetched;

  const category =
    scope === 'category'
      ? categories.find(item => item.slug === slug)
      : undefined;
  const brand =
    scope === 'brand' ? brands.find(item => item.slug === slug) : undefined;
  const found = category ?? brand;
  const title = found?.name ?? (slug ? prettifySlug(slug) : 'Shop');
  const description =
    found?.description ??
    (scope
      ? undefined
      : 'Everything in the store. Filter by price and rating, then sort.');

  const handlePageChange = (page: number) => {
    dispatch(filterProducts('pagination', page));
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className='container-page py-10 lg:py-14'>
      <Breadcrumb className='mb-8'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href='/'>Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {scope ? (
              <BreadcrumbLink asChild>
                <Link href='/shop'>Shop</Link>
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>Shop</BreadcrumbPage>
            )}
          </BreadcrumbItem>
          {scope && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader title={title} description={description} />

      <div className='mt-10 grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12'>
        <aside
          aria-label='Product filters'
          className='hidden self-start lg:sticky lg:top-24 lg:block'
        >
          <ShopFilters />
        </aside>

        <div ref={gridTop} className='min-w-0 scroll-mt-28'>
          <div className='mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-foreground pb-3'>
            <p className='tabular text-sm' aria-live='polite'>
              {totalProducts > 0
                ? `Showing ${left}–${right} of ${count} products`
                : `${count} products`}
            </p>

            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                size='sm'
                className='lg:hidden'
                onClick={() => setFiltersOpen(true)}
              >
                Filters
              </Button>
              <label htmlFor='shop-sort' className='meta hidden sm:block'>
                Sort by
              </label>
              <Select
                value={String(order)}
                onValueChange={value =>
                  dispatch(filterProducts('sorting', Number(value)))
                }
              >
                <SelectTrigger
                  id='shop-sort'
                  size='sm'
                  className='min-w-48'
                  aria-label='Sort products'
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={String(option.value)}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showSkeleton ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              title='No products found.'
              description='Try adjusting the price range or rating, or browse the whole shop.'
              action={
                <Button asChild variant='outline'>
                  <Link href='/shop'>Browse all products</Link>
                </Button>
              }
            />
          )}

          {!showSkeleton && totalPages > 1 && (
            <PaginationBar
              className='mt-10'
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side='left' className='w-full gap-0 sm:max-w-sm'>
          <SheetHeader className='border-b border-foreground'>
            <SheetTitle className='font-heading text-3xl leading-none font-semibold uppercase'>
              Filters
            </SheetTitle>
            <SheetDescription>
              Narrow the products by price and rating.
            </SheetDescription>
          </SheetHeader>
          <div className='overflow-y-auto p-5'>
            <ShopFilters />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
