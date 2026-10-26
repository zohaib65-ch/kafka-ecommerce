'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import { fetchAddresses } from '@/store/address/actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { AddressList } from './address-list';

export function AddressesView() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const addresses = useAppSelector(state => state.address.addresses);
  const isLoading = useAppSelector(state => state.address.isLoading);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const add = () => router.push('/dashboard/address/add');

  return (
    <SubPage
      title='Addresses'
      description='The places we deliver your orders.'
      actions={
        <Button size='sm' onClick={add}>
          Add address
        </Button>
      }
    >
      {addresses.length > 0 ? (
        <AddressList addresses={addresses} />
      ) : isLoading ? (
        <InlineLoader label='Loading addresses' />
      ) : (
        <EmptyState
          message='No addresses found.'
          description='Add an address to speed up checkout.'
          action={<Button onClick={add}>Add address</Button>}
        />
      )}
    </SubPage>
  );
}
