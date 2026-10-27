'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { SubPage } from '@/components/dashboard/sub-page';
import {
  Form,
  NumberField,
  SelectField,
  SubmitButton,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading';
import { ProductImage } from '@/components/shared/product-image';
import { Button } from '@/components/ui/button';
import { ROLES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import {
  editProductSchema,
  productToFormValues,
  taxableOptions
} from '@/lib/validations/product';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBrandsSelect } from '@/store/brand/actions';
import {
  activateProduct,
  deleteProduct,
  fetchProduct,
  updateProduct
} from '@/store/product/actions';
import { resetProduct } from '@/store/product/slice';
import type { ProductDetail } from '@/types';

import { ActiveSwitch } from './active-switch';
import { CancelButton } from './cancel-button';
import { FormActions, FormSection } from './form-parts';
import { PublicLink } from './public-link';
import { useLoad } from './use-load';

function EditProductForm({ product }: { product: ProductDetail }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.account.user);
  const brandsSelect = useAppSelector(state => state.brand.brandsSelect);
  const [isActive, setIsActive] = useState(product.isActive);

  const form = useZodForm(editProductSchema, {
    defaultValues: productToFormValues(product)
  });

  const brandOptions = useMemo(
    () =>
      brandsSelect.map(option => ({
        value: String(option.value),
        label: option.label
      })),
    [brandsSelect]
  );

  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  const handleActiveChange = async (value: boolean) => {
    setIsActive(value);
    const ok = await dispatch(activateProduct(product._id, value));
    if (!ok) setIsActive(!value);
  };

  return (
    <div className='space-y-8'>
      <div className='flex items-center gap-5'>
        <ProductImage
          product={product}
          sizes='96px'
          className='size-24 shrink-0 border'
        />
        <div className='min-w-0 space-y-1'>
          <p className='truncate text-2xl font-semibold'>{product.name}</p>
          <PublicLink
            label='Product link'
            href={`/product/${product.slug}`}
            slug={product.slug}
          />
        </div>
      </div>

      <ActiveSwitch
        checked={isActive}
        onCheckedChange={handleActiveChange}
        hint='Inactive products are hidden from the shop.'
      />

      <Form
        form={form}
        className='space-y-8'
        onSubmit={async values => {
          const ok = await dispatch(updateProduct(product._id, values));
          if (ok) form.reset(values);
        }}
      >
        <FormSection title='Details'>
          <TextField
            control={form.control}
            name='name'
            label='Name'
            placeholder='Product Name'
            autoComplete='off'
            required
          />
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
              name='slug'
              label='Slug'
              placeholder='Product Slug'
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
          {user.role === ROLES.Admin && (
            <SelectField
              control={form.control}
              name='brand'
              label='Select Brand'
              placeholder='Select a brand'
              options={brandOptions}
              required
            />
          )}
        </FormSection>

        <FormActions>
          <SubmitButton loading={form.formState.isSubmitting}>
            Save
          </SubmitButton>
          <ConfirmDialog
            title={`Delete ${product.name}?`}
            description='This permanently removes the product from the shop. This action cannot be undone.'
            confirmLabel='Delete product'
            onConfirm={() => dispatch(deleteProduct(product._id))}
            trigger={
              <Button type='button' variant='destructive'>
                <Trash2 /> Delete
              </Button>
            }
          />
        </FormActions>
      </Form>
    </div>
  );
}

export function EditProductPage({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(state => state.product.product);

  useEffect(() => {
    dispatch(resetProduct());
  }, [dispatch, id]);

  const loaded = useLoad(
    useCallback(
      () =>
        Promise.all([
          dispatch(fetchProduct(id)),
          dispatch(fetchBrandsSelect())
        ]),
      [dispatch, id]
    )
  );

  return (
    <SubPage
      title='Edit Product'
      description='Change the product details or remove it from the shop.'
      actions={<CancelButton />}
    >
      {!loaded ? (
        <PageLoader label='Loading product' className='min-h-[30vh]' />
      ) : product?._id ? (
        <EditProductForm key={product._id} product={product} />
      ) : (
        <EmptyState message='No product found.' />
      )}
    </SubPage>
  );
}
