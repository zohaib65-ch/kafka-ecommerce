'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategories } from '@/store/category/actions';
import type { Category } from '@/types';

import { ResponsiveTable, type Column } from './responsive-table';
import { useLoad } from './use-load';

const columns: Column<Category>[] = [
  {
    id: 'category',
    header: 'Category',
    primary: true,
    className: 'w-full max-w-0',
    cell: category => (
      <div className='min-w-0'>
        <Link
          href={`/dashboard/category/edit/${category._id}`}
          className='block truncate font-semibold underline-offset-4 hover:underline hover:decoration-brand hover:decoration-2'
        >
          {category.name}
        </Link>
        <p className='truncate text-sm text-muted-foreground'>
          {category.description}
        </p>
      </div>
    )
  },
  {
    id: 'products',
    header: 'Products',
    cell: category => (
      <span className='tabular'>{category.products?.length ?? 0}</span>
    )
  },
  {
    id: 'status',
    header: 'Status',
    cell: category => (
      <StatusBadge
        status={category.isActive ? 'Active' : 'Disabled'}
        tone={category.isActive ? 'success' : 'neutral'}
      />
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    hideLabel: true,
    className: 'text-right',
    cell: category => (
      <Button variant='outline' size='sm' asChild>
        <Link
          href={`/dashboard/category/edit/${category._id}`}
          aria-label={`Edit ${category.name}`}
        >
          <Pencil /> Edit
        </Link>
      </Button>
    )
  }
];

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
      description='Groups that shoppers browse the shop by.'
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
        <ResponsiveTable
          caption='Categories'
          rows={categories}
          columns={columns}
          getRowKey={category => category._id}
        />
      ) : (
        <EmptyState message='No categories found.' />
      )}
    </SubPage>
  );
}
