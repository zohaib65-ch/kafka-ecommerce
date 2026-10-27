'use client';

import {
  Form,
  SubmitButton,
  TextField,
  TextareaField,
  useZodForm
} from '@/components/forms';
import {
  merchantDefaultValues,
  merchantSchema
} from '@/lib/validations/merchant';
import { useAppDispatch } from '@/store/hooks';
import { addMerchant } from '@/store/merchant/actions';

import { FormActions, FormSection } from './form-parts';

type MerchantFormProps = {
  submitTitle?: string;
  /** Go back to the previous page after a successful submit (the admin "Add merchant" page). */
  goBack?: boolean;
};

/** Merchant application form: name, contact details, brand and a business description. */
export function MerchantForm({
  submitTitle = 'Submit',
  goBack = false
}: MerchantFormProps) {
  const dispatch = useAppDispatch();
  const form = useZodForm(merchantSchema, {
    defaultValues: merchantDefaultValues
  });

  return (
    <Form
      form={form}
      className='space-y-8'
      onSubmit={async values => {
        const ok = await dispatch(addMerchant(values, goBack));
        if (ok) form.reset();
      }}
    >
      <FormSection title='Merchant'>
        <TextField
          control={form.control}
          name='name'
          label='Name'
          placeholder='Your Full Name'
          autoComplete='name'
          required
        />
        <div className='grid gap-5 sm:grid-cols-2'>
          <TextField
            control={form.control}
            name='email'
            type='email'
            label='Email Address'
            placeholder='Your Email Address'
            autoComplete='email'
            required
          />
          <TextField
            control={form.control}
            name='phoneNumber'
            type='tel'
            label='Phone Number'
            placeholder='Your Phone Number'
            autoComplete='tel'
            required
          />
        </div>
        <TextField
          control={form.control}
          name='brandName'
          label='Brand'
          placeholder='Your Business Brand'
          autoComplete='organization'
          required
        />
        <TextareaField
          control={form.control}
          name='business'
          label='Business'
          placeholder='Please Describe Your Business'
          required
        />
      </FormSection>
      <FormActions>
        <SubmitButton loading={form.formState.isSubmitting}>
          {submitTitle}
        </SubmitButton>
      </FormActions>
    </Form>
  );
}
