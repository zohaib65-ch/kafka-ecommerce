'use client';

import { useRouter } from 'next/navigation';

import { SubPage } from '@/components/dashboard/sub-page';
import { EmptyState } from '@/components/shared/empty-state';
import { InlineLoader } from '@/components/shared/loading';
import { useLoadedFor } from '@/components/orders/use-loaded-for';
import { fetchAddresses } from '@/store/address/actions';
import { useAppSelector } from '@/store/hooks';
import type { AppThunk } from '@/store';

import { EditAddressForm } from './address-form';

// The address comes from the user's own address list instead of GET /address/:id: the list
// already holds every editable field, and an unknown id in the URL then never reaches the API.
const loadAddresses = (): AppThunk<Promise<unknown>> => fetchAddresses();

export function EditAddressView({ id }: { id: string }) {
  const router = useRouter();
  const loaded = useLoadedFor('addresses', loadAddresses);
  const address = useAppSelector(state =>
    state.address.addresses.find(item => item._id === id)
  );

  return (
    <SubPage
      title='Edit Address'
      actionTitle='Cancel'
      handleAction={() => router.back()}
    >
      {!loaded ? (
        <InlineLoader label='Loading address' />
      ) : address ? (
        <EditAddressForm key={address._id} address={address} />
      ) : (
        <EmptyState message='No address found.' />
      )}
    </SubPage>
  );
}
