'use client';

import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { SubPage } from '@/components/dashboard/sub-page';
import {
  FileField,
  Form,
  NumberField,
  SelectField,
  SubmitButton,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import { ROLES } from '@/lib/constants';
import {
  NO_BRAND_VALUE,
  addProductDefaultValues,
  addProductSchema,
  taxableOptions
} from '@/lib/validations/product';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBrandsSelect } from '@/store/brand/actions';
import { addProduct } from '@/store/product/actions';

import { CancelButton } from './cancel-button';
import { ActiveSwitchField } from './active-switch-field';
import { FormActions, FormSection } from './form-parts';

export function AddProductPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.account.user);
  const brandsSelect = useAppSelector(state => state.brand.brandsSelect);
  const isMerchant = user.role === ROLES.Merchant;

  // The brand starts empty so the select shows its placeholder ('0' means "no brand" and is rejected).
  const form = useZodForm(addProductSchema, {
    defaultValues: { ...addProductDefaultValues, brand: '' }
  });

  useEffect(() => {
    dispatch(fetchBrandsSelect());
  }, [dispatch]);

  // Merchants can only sell under their own brand: `brandsSelect[0]` is the empty option and
  // `brandsSelect[1]` their brand (the thunk enforces it as well).
  const merchantBrand = isMerchant ? brandsSelect[1] : undefined;
  const merchantBrandValue = merchantBrand
    ? String(merchantBrand.value)
    : undefined;

  useEffect(() => {
    if (merchantBrandValue) {
      form.setValue('brand', merchantBrandValue, { shouldValidate: false });
    }
  }, [merchantBrandValue, form]);

  const brandOptions = useMemo(() => {
    const options = brandsSelect.map(option => ({
      value: String(option.value),
      label: option.label
    }));
    if (isMerchant) {
      return options.filter(option => option.value === merchantBrandValue);
    }
    return options.filter(option => option.value !== NO_BRAND_VALUE);
  }, [brandsSelect, isMerchant, merchantBrandValue]);

  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  return (
    <SubPage
      title='Add Product'
      description='Add a product to the shop.'
      actions={<CancelButton />}
    >
      <Form
        form={form}
        className='space-y-8'
        onSubmit={async values => {
          await dispatch(addProduct(values));
        }}
      >
        <FormSection title='Details'>
          <div className='grid gap-5 lg:grid-cols-2'>
            <TextField
              control={form.control}
              name='sku'
              label='Sku'
              placeholder='Product Sku'
              autoComplete='off'
              required
            />
            <TextField
              control={form.control}
              name='name'
              label='Name'
              placeholder='Product Name'
              autoComplete='off'
              required
            />
          </div>
          <TextareaField
            control={form.control}
            name='description'
            label='Description'
            placeholder='Product Description'
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

        <FormSection title='Pricing & inventory'>
          <div className='grid gap-5 lg:grid-cols-2'>
            <NumberField
              control={form.control}
              name='quantity'
              label='Quantity'
              placeholder='Product Quantity'
              valueAs='string'
              integer
              min={0}
              required
            />
            <NumberField
              control={form.control}
              name='price'
              label='Price'
              placeholder='Product Price'
              valueAs='string'
              min={0}
              prefix='$'
              required
            />
          </div>
          <SelectField
            control={form.control}
            name='taxable'
            label='Taxable'
            options={[...taxableOptions]}
            required
          />
        </FormSection>

        <FormSection title='Brand & visibility'>
          <SelectField
            control={form.control}
            name='brand'
            label='Select Brand'
            placeholder='Select a brand'
            options={brandOptions}
            disabled={isMerchant}
            description={
              isMerchant ? 'Merchants sell under their own brand.' : undefined
            }
            required
          />
          <ActiveSwitchField
            control={form.control}
            name='isActive'
            hint='Inactive products are hidden from the shop.'
          />
        </FormSection>

        <FormSection title='Image'>
          <FileField
            control={form.control}
            name='image'
            label='Product image'
            description='Upload a JPG or PNG photo.'
            required
          />
        </FormSection>

        <FormActions>
          <SubmitButton loading={form.formState.isSubmitting}>
            Add Product
          </SubmitButton>
        </FormActions>
      </Form>
    </SubPage>
  );
}
