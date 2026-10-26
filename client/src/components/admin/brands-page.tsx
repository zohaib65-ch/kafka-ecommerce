'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { Plus, Tag } from 'lucide-react';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBrands } from '@/store/brand/actions';
import type { Brand } from '@/types';

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

  return (
    <SubPage
      title={isAdmin ? 'Brands' : 'Brand'}
      description={
        isAdmin
          ? 'Brands that products can be listed under.'
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
        <ul className='grid gap-4 sm:grid-cols-2'>
          {brands.map(brand => (
            <li key={brand._id}>
              <Link
                href={`/dashboard/brand/edit/${brand._id}`}
                className='flex h-full flex-col gap-3 rounded-2xl border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none'
              >
                <div className='flex items-start justify-between gap-3'>
                  <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
                    <Tag className='size-5' aria-hidden='true' />
                  </span>
                  <StatusBadge
                    status={brand.isActive ? 'Active' : 'Disabled'}
                    tone={brand.isActive ? 'success' : 'neutral'}
                  />
                </div>
                <div className='min-w-0 flex-1'>
                  <h2 className='truncate text-base font-semibold'>
                    {brand.name}
                  </h2>
                  <p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>
                    {brand.description}
                  </p>
                </div>
                {brand.merchant && brand.merchant._id !== userMerchantId && (
                  <p className='text-sm'>
                    <span className='text-muted-foreground'>By </span>
                    <span className='font-medium text-primary'>
                      {brand.merchant.name}
                    </span>
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState message='No brands found.' />
      )}
    </SubPage>
  );
}
