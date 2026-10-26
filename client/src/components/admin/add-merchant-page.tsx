'use client';

import { SubPage } from '@/components/dashboard/sub-page';

import { CancelButton } from './cancel-button';
import { FormCard } from './form-parts';
import { MerchantForm } from './merchant-form';

export function AddMerchantPage() {
  return (
    <SubPage
      title='Add Merchant'
      description='Create a merchant application on behalf of a seller.'
      actions={<CancelButton />}
    >
      <FormCard>
        <MerchantForm submitTitle='Add Merchant' goBack />
      </FormCard>
    </SubPage>
  );
}
