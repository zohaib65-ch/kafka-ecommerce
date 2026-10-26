'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { LayoutGrid, Plus } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/store/category/actions';

import { useLoad } from './use-load';

export function CategoriesPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category.categories);
  const isLoading = useAppSelector(state => state.category.isLoading);

  const loaded = useLoad(
    useCallback(() => dispatch(fetchCategories()), [dispatch])
  );

  return (
    <SubPage
      title='Categories'
      description='Group products so shoppers can browse them by department.'
      actions={
        <Button size='sm' asChild>
          <Link href='/dashboard/category/add'>
            <Plus /> Add category
          </Link>
        </Button>
      }
    >
      {!loaded || isLoading ? (
        <InlineLoader label='Loading categories' />
      ) : categories.length > 0 ? (
        <ul className='grid gap-4 sm:grid-cols-2'>
          {categories.map(category => (
            <li key={category._id}>
              <Link
                href={`/dashboard/category/edit/${category._id}`}
                className='flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
              >
                <div className='flex items-start justify-between gap-3'>
                  <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
                    <LayoutGrid className='size-5' aria-hidden='true' />
                  </span>
                  <StatusBadge
                    status={category.isActive ? 'Active' : 'Disabled'}
                    tone={category.isActive ? 'success' : 'neutral'}
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate text-base font-semibold'>
                    {category.name}
                  </h2>
                  <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                    {category.description}
                  </p>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {category.products?.length ?? 0}{' '}
                  {(category.products?.length ?? 0) === 1
                    ? 'product'
                    : 'products'}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState message='No categories found.' />
      )}
    </SubPage>
  );
}
