'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { cn } from '@/lib/utils';
import {
  categoryToFormValues,
  editCategorySchema
} from '@/lib/validations/category';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  activateCategory,
  deleteCategory,
  fetchCategory,
  updateCategory
} from '@/store/category/actions';
import { resetCategory } from '@/store/category/slice';
import { fetchProductsSelect } from '@/store/product/actions';
import type { CategoryDetail } from '@/types';

import { ActiveSwitch } from './active-switch';
import { CancelButton } from './cancel-button';
import { FormActions, FormSection } from './form-parts';
import { IdMultiSelectField } from './id-multi-select-field';
import { PublicLink } from './public-link';
import { useLoad } from './use-load';

function EditCategoryForm({ category }: { category: CategoryDetail }) {
  const dispatch = useAppDispatch();
  const productsSelect = useAppSelector(state => state.product.productsSelect);
  const [isActive, setIsActive] = useState(category.isActive);

  const form = useZodForm(editCategorySchema, {
    defaultValues: categoryToFormValues(category)
  });
  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  // The category's own products are always selectable, even before the full list has loaded.
  const productOptions = useMemo(() => {
    const options = new Map<string, string>();
    productsSelect.forEach(option =>
      options.set(String(option.value), option.label)
    );
    category.products.forEach(option =>
      options.set(String(option.value), option.label)
    );
    return [...options].map(([value, label]) => ({ value, label }));
  }, [productsSelect, category.products]);

  const handleActiveChange = async (value: boolean) => {
    setIsActive(value);
    const ok = await dispatch(activateCategory(category._id, value));
    if (!ok) setIsActive(!value);
  };

  return (
    <div className='space-y-8'>
      <PublicLink
        label='Category link'
        href={`/shop/category/${category.slug}`}
        slug={category.slug}
      />

      <ActiveSwitch
        checked={isActive}
        onCheckedChange={handleActiveChange}
        hint={`Disabling ${category.name} will also disable all ${category.name} products.`}
      />

      <Form
        form={form}
        className='space-y-8'
        onSubmit={async values => {
          await dispatch(updateCategory(category._id, values));
        }}
      >
        <FormSection title='Details'>
          <TextField
            control={form.control}
            name='name'
            label='Name'
            placeholder='Category Name'
            autoComplete='off'
            required
          />
          <TextField
            control={form.control}
            name='slug'
            label='Slug'
            placeholder='Category Slug'
            autoComplete='off'
            required
          />
          <TextareaField
            control={form.control}
            name='description'
            label='Description'
            placeholder='Category Description'
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
          <IdMultiSelectField
            control={form.control}
            name='products'
            label='Select Products'
            placeholder='Select products'
            options={productOptions}
            required
          />
        </FormSection>
        <FormActions>
          <SubmitButton loading={form.formState.isSubmitting}>
            Save
          </SubmitButton>
          <ConfirmDialog
            title={`Delete ${category.name}?`}
            description='This permanently removes the category. This action cannot be undone.'
            confirmLabel='Delete category'
            onConfirm={() => dispatch(deleteCategory(category._id))}
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

export function EditCategoryPage({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const category = useAppSelector(state => state.category.category);

  useEffect(() => {
    dispatch(resetCategory());
  }, [dispatch, id]);

  const loaded = useLoad(
    useCallback(
      () =>
        Promise.all([
          dispatch(fetchCategory(id)),
          dispatch(fetchProductsSelect())
        ]),
      [dispatch, id]
    )
  );

  return (
    <SubPage
      title='Edit Category'
      description='Change the category details and its products.'
      actions={<CancelButton />}
    >
      {!loaded ? (
        <PageLoader label='Loading category' className='min-h-[30vh]' />
      ) : category?._id ? (
        <EditCategoryForm key={category._id} category={category} />
      ) : (
        <EmptyState message='No category found.' />
      )}
    </SubPage>
  );
}
