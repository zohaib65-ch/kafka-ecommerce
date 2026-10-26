'use client';

import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';

import { SubPage } from '@/components/dashboard/sub-page';
import {
  Form,
  SubmitButton,
  SwitchField,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import { cn } from '@/lib/utils';
import {
  addCategoryDefaultValues,
  addCategorySchema
} from '@/lib/validations/category';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCategory } from '@/store/category/actions';
import { fetchProductsSelect } from '@/store/product/actions';

import { CancelButton } from './cancel-button';
import { FormActions, FormCard } from './form-parts';
import { IdMultiSelectField } from './id-multi-select-field';

export function AddCategoryPage() {
  const dispatch = useAppDispatch();
  const productsSelect = useAppSelector(state => state.product.productsSelect);
  const form = useZodForm(addCategorySchema, {
    defaultValues: addCategoryDefaultValues
  });
  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  useEffect(() => {
    dispatch(fetchProductsSelect());
  }, [dispatch]);

  const productOptions = useMemo(
    () =>
      productsSelect.map(option => ({
        value: String(option.value),
        label: option.label
      })),
    [productsSelect]
  );

  return (
    <SubPage
      title='Add Category'
      description='Create a category and choose the products that belong to it.'
      actions={<CancelButton />}
    >
      <FormCard>
        <Form
          form={form}
          onSubmit={async values => {
            await dispatch(addCategory(values));
          }}
        >
          <TextField
            control={form.control}
            name='name'
            label='Name'
            placeholder='Category Name'
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
          <SwitchField
            control={form.control}
            name='isActive'
            label='Active?'
            description='Inactive categories are hidden from the shop.'
          />
          <FormActions>
            <SubmitButton loading={form.formState.isSubmitting}>
              Add Category
            </SubmitButton>
          </FormActions>
        </Form>
      </FormCard>
    </SubPage>
  );
}
