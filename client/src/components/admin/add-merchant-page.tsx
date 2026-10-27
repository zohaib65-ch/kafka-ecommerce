'use client';

import { SubPage } from '@/components/dashboard/sub-page';

import { CancelButton } from './cancel-button';
import { MerchantForm } from './merchant-form';

export function AddMerchantPage() {
  return (
    <SubPage
      title='Add Merchant'
      description='Create a merchant application for a seller.'
      actions={<CancelButton />}
    >
      <MerchantForm submitTitle='Add Merchant' goBack />
    </SubPage>
  );
}
