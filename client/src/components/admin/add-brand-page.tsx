'use client';

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
import { addBrandDefaultValues, addBrandSchema } from '@/lib/validations/brand';
import { DESCRIPTION_MAX_LENGTH } from '@/lib/validations/common';
import { useAppDispatch } from '@/store/hooks';
import { addBrand } from '@/store/brand/actions';

import { CancelButton } from './cancel-button';
import { FormActions, FormCard } from './form-parts';

export function AddBrandPage() {
  const dispatch = useAppDispatch();
  const form = useZodForm(addBrandSchema, {
    defaultValues: addBrandDefaultValues
  });
  const description =
    useWatch({ control: form.control, name: 'description' }) ?? '';

  return (
    <SubPage
      title='Add Brand'
      description='Create a brand that products can be listed under.'
      actions={<CancelButton />}
    >
      <FormCard>
        <Form
          form={form}
          onSubmit={async values => {
            await dispatch(addBrand(values));
          }}
        >
          <TextField
            control={form.control}
            name='name'
            label='Name'
            placeholder='Brand Name'
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
          <SwitchField
            control={form.control}
            name='isActive'
            label='Active?'
            description='Inactive brands are hidden from the shop.'
          />
          <FormActions>
            <SubmitButton loading={form.formState.isSubmitting}>
              Add Brand
            </SubmitButton>
          </FormActions>
        </Form>
      </FormCard>
    </SubPage>
  );
}
