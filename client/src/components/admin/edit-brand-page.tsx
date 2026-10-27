'use client';

import { useCallback, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { SubPage } from '@/components/dashboard/sub-page';
import {
  Form,
  SubmitButton,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { brandToFormValues, editBrandSchema } from '@/lib/validations/brand';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activateBrand,
  deleteBrand,
  fetchBrand,
  updateBrand
} from '@/store/brand/actions';
import type { Brand } from '@/types';

import { ActiveSwitch } from './active-switch';
import { CancelButton } from './cancel-button';
import { FormActions, FormSection } from './form-parts';
import { PublicLink } from './public-link';
import { useLoad } from './use-load';

function EditBrandForm({ brand }: { brand: Brand }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.account.user);
  const isMerchant = user.role === ROLES.Merchant;
  const [isActive, setIsActive] = useState(brand.isActive);

  const form = useZodForm(editBrandSchema, {
    defaultValues: brandToFormValues(brand)
  });
  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  const handleActiveChange = async (value: boolean) => {
    setIsActive(value);
    const ok = await dispatch(activateBrand(brand._id, value));
    if (!ok) setIsActive(!value);
  };

  return (
    <div className='space-y-8'>
      <PublicLink
        label='Brand link'
        href={`/shop/brand/${brand.slug}`}
        slug={brand.slug}
      />

      <ActiveSwitch
        checked={isActive}
        onCheckedChange={handleActiveChange}
        hint={`Disabling ${brand.name} will also disable all ${brand.name} products.`}
      />

      <Form
        form={form}
        className='space-y-8'
        onSubmit={async values => {
          await dispatch(updateBrand(brand._id, values));
        }}
      >
        <FormSection title='Details'>
          <TextField
            control={form.control}
            name='name'
            label='Name'
            placeholder='Brand Name'
            autoComplete='off'
            required
          />
          <TextField
            control={form.control}
            name='slug'
            label='Slug'
            placeholder='Brand Slug'
            autoComplete='off'
            required
          />
          <TextareaField
            control={form.control}
            name='description'
            label='Description'
            placeholder='Brand Description'
            required
            description={
              <span
                className={cn(
                  description.length > DESCRIPTION_MAX_LENGTH &&
                    'text-destructive'
                )}
              >
                {description.length}/{DESCRIPTION_MAX_LENGTH} characters
              </span>
            }
          />
        </FormSection>
        <FormActions>
          <SubmitButton loading={form.formState.isSubmitting}>
            Save
          </SubmitButton>
          <ConfirmDialog
            title={`Delete ${brand.name}?`}
            description='This permanently removes the brand. This action cannot be undone.'
            confirmLabel='Delete brand'
            onConfirm={() => dispatch(deleteBrand(brand._id))}
            trigger={
              <Button type='button' variant='destructive' disabled={isMerchant}>
                <Trash2 /> Delete
              </Button>
            }
          />
        </FormActions>
      </Form>
    </div>
  );
}

export function EditBrandPage({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const brand = useAppSelector(state => state.brand.brand);

  const loaded = useLoad(
    useCallback(() => dispatch(fetchBrand(id)), [dispatch, id])
  );

  return (
    <SubPage
      title='Edit Brand'
      description='Change the brand details.'
      actions={<CancelButton />}
    >
      {!loaded ? (
        <PageLoader label='Loading brand' className='min-h-[30vh]' />
      ) : brand?._id === id ? (
        <EditBrandForm key={brand._id} brand={brand} />
      ) : (
        <EmptyState message='No brand found.' />
      )}
    </SubPage>
  );
}
