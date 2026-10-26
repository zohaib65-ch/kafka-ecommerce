'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { ProductImage } from '@/components/shared/product-image';
import { StatusBadge } from '@/components/shared/status-badge';
import { SubPage } from '@/components/dashboard/sub-page';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/product/actions';
import type { ManagedProduct } from '@/types';

import { ResponsiveTable, type Column } from './responsive-table';
import { useLoad } from './use-load';

const columns: Column<ManagedProduct>[] = [
  {
    id: 'product',
    header: 'Product',
    primary: true,
    className: 'w-full max-w-0',
    cell: product => (
      <div className='flex min-w-0 items-center gap-3'>
        <ProductImage
          product={product}
          sizes='56px'
          className='size-14 shrink-0 rounded-xl border'
        />
        <div className='min-w-0'>
          <Link
            href={`/dashboard/product/edit/${product._id}`}
            className='block truncate font-medium hover:text-primary'
          >
            {product.name}
          </Link>
          <p className='truncate text-sm text-muted-foreground'>
            <span className='font-mono text-xs'>{product.sku}</span>
            {product.brand?.name ? ` · ${product.brand.name}` : ''}
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'price',
    header: 'Price',
    cell: product => (
      <span className='font-medium'>{formatPrice(product.price)}</span>
    )
  },
  {
    id: 'stock',
    header: 'Stock',
    cell: product => (
      <span
        className={cn(product.quantity <= 0 && 'font-medium text-destructive')}
      >
        {product.quantity <= 0 ? 'Out of stock' : product.quantity}
      </span>
    )
  },
  {
    id: 'status',
    header: 'Status',
    cell: product => (
      <StatusBadge
        status={product.isActive ? 'Active' : 'Disabled'}
        tone={product.isActive ? 'success' : 'neutral'}
      />
    )
  },
  {
    id: 'actions',
    header: 'Actions',
    hideLabel: true,
    className: 'text-right',
    cell: product => (
      <Button variant='outline' size='sm' asChild>
        <Link
          href={`/dashboard/product/edit/${product._id}`}
          aria-label={`Edit ${product.name}`}
        >
          <Pencil /> Edit
        </Link>
      </Button>
    )
  }
];

export function ProductsPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector(state => state.product.products);
  const isLoading = useAppSelector(state => state.product.isLoading);

  const loaded = useLoad(
    useCallback(() => dispatch(fetchProducts()), [dispatch])
  );

  return (
    <SubPage
      title='Products'
      description='Everything that is listed in the shop.'
      actions={
        <Button size='sm' asChild>
          <Link href='/dashboard/product/add'>
            <Plus /> Add product
          </Link>
        </Button>
      }
    >
      {!loaded || isLoading ? (
        <InlineLoader label='Loading products' />
      ) : products.length > 0 ? (
        <ResponsiveTable
          caption='Products'
          rows={products}
          columns={columns}
          getRowKey={product => product._id}
        />
      ) : (
        <EmptyState message='No products found.' />
      )}
    </SubPage>
  );
}
