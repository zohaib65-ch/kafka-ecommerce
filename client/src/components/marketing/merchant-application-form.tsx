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

type MerchantApplicationFormProps = {
  submitLabel?: string;
  /** Go back to the previous page after a successful submit (the admin "Add Merchant" flow). */
  goBackOnSuccess?: boolean;
};

/** Seller application: used on /sell and reusable for the admin "Add Merchant" page. */
export function MerchantApplicationForm({
  submitLabel = 'Submit',
  goBackOnSuccess = false
}: MerchantApplicationFormProps) {
  const dispatch = useAppDispatch();
  const form = useZodForm(merchantSchema, {
    defaultValues: merchantDefaultValues
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        const ok = await dispatch(addMerchant(values, goBackOnSuccess));
        if (ok) form.reset();
      }}
    >
      <TextField
        control={form.control}
        name='name'
        label='Name'
        placeholder='Your Full Name'
        autoComplete='name'
      />
      <div className='grid gap-5 sm:grid-cols-2'>
        <TextField
          control={form.control}
          name='email'
          type='email'
          label='Email Address'
          placeholder='Your Email Address'
          autoComplete='email'
        />
        <TextField
          control={form.control}
          name='phoneNumber'
          type='tel'
          label='Phone Number'
          placeholder='Your Phone Number'
          autoComplete='tel'
        />
      </div>
      <TextField
        control={form.control}
        name='brandName'
        label='Brand'
        placeholder='Your Business Brand'
      />
      <TextareaField
        control={form.control}
        name='business'
        label='Business'
        placeholder='Please Describe Your Business'
        rows={5}
      />
      <SubmitButton
        size='lg'
        className='w-full sm:w-auto'
        loading={form.formState.isSubmitting}
      >
        {submitLabel}
      </SubmitButton>
    </Form>
  );
}
