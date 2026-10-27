'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Pencil, Plus } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBrands } from '@/store/brand/actions';
import type { Brand } from '@/types';

import { ResponsiveTable, type Column } from './responsive-table';
import { useLoad } from './use-load';

// The dashboard list populates the owner merchant (`GET /brand`), unlike the plain Brand type.
type ListedBrand = Omit<Brand, 'merchant'> & {
  merchant?: { _id: string; name: string } | null;
};

export function BrandsPage() {
  const dispatch = useAppDispatch();
  const brands = useAppSelector(
    state => state.brand.brands
  ) as unknown as ListedBrand[];
  const isLoading = useAppSelector(state => state.brand.isLoading);
  const user = useAppSelector(state => state.account.user);
  const isAdmin = user.role === ROLES.Admin;

  const userMerchantId =
    typeof user.merchant === 'object' && user.merchant
      ? user.merchant._id
      : user.merchant;

  const loaded = useLoad(
    useCallback(() => dispatch(fetchBrands()), [dispatch])
  );

  const columns: Column<ListedBrand>[] = [
    {
      id: 'brand',
      header: 'Brand',
      primary: true,
      className: 'w-full max-w-0',
      cell: brand => (
        <div className='min-w-0'>
          <Link
            href={`/dashboard/brand/edit/${brand._id}`}
            className='block truncate font-semibold underline-offset-4 hover:underline hover:decoration-brand hover:decoration-2'
          >
            {brand.name}
          </Link>
          <p className='truncate text-sm text-muted-foreground'>
            {brand.description}
          </p>
        </div>
      )
    },
    {
      id: 'merchant',
      header: 'Merchant',
      cell: brand =>
        brand.merchant && brand.merchant._id !== userMerchantId
          ? brand.merchant.name
          : '–'
    },
    {
      id: 'status',
      header: 'Status',
      cell: brand => (
        <StatusBadge
          status={brand.isActive ? 'Active' : 'Disabled'}
          tone={brand.isActive ? 'success' : 'neutral'}
        />
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      hideLabel: true,
      className: 'text-right',
      cell: brand => (
        <Button variant='outline' size='sm' asChild>
          <Link
            href={`/dashboard/brand/edit/${brand._id}`}
            aria-label={`Edit ${brand.name}`}
          >
            <Pencil /> Edit
          </Link>
        </Button>
      )
    }
  ];

  return (
    <SubPage
      title={isAdmin ? 'Brands' : 'Brand'}
      description={
        isAdmin
          ? 'Brands that products are listed under.'
          : 'The brand your products are listed under.'
      }
      actions={
        isAdmin && (
          <Button size='sm' asChild>
            <Link href='/dashboard/brand/add'>
              <Plus /> Add brand
            </Link>
          </Button>
        )
      }
    >
      {!loaded || isLoading ? (
        <InlineLoader label='Loading brands' />
      ) : brands.length > 0 ? (
        <ResponsiveTable
          caption='Brands'
          rows={brands}
          columns={columns}
          getRowKey={brand => brand._id}
        />
      ) : (
        <EmptyState message='No brands found.' />
      )}
    </SubPage>
  );
}
