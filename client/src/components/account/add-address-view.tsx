'use client';

import { useRouter } from 'next/navigation';

import { SubPage } from '@/components/dashboard/sub-page';

import { AddAddressForm } from './address-form';

export function AddAddressView() {
  const router = useRouter();

  return (
    <SubPage
      title='Add Address'
      actionTitle='Cancel'
      handleAction={() => router.back()}
    >
      <AddAddressForm />
    </SubPage>
  );
}
