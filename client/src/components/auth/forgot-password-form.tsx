'use client';

import { Form, SubmitButton, TextField, useZodForm } from '@/components/forms';
import {
  forgotPasswordDefaultValues,
  forgotPasswordSchema
} from '@/lib/validations/auth';
import { forgotPassword } from '@/store/forgot-password/actions';
import { useAppDispatch } from '@/store/hooks';

export function ForgotPasswordForm() {
  const dispatch = useAppDispatch();
  const form = useZodForm(forgotPasswordSchema, {
    defaultValues: forgotPasswordDefaultValues
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        // On success the thunk shows the confirmation and sends the user back to the login page.
        await dispatch(forgotPassword(values));
      }}
    >
      <TextField
        control={form.control}
        name='email'
        type='email'
        label='Email Address'
        placeholder='you@example.com'
        autoComplete='email'
      />
      <SubmitButton
        size='lg'
        className='w-full'
        loading={form.formState.isSubmitting}
      >
        Send reset link
      </SubmitButton>
    </Form>
  );
}
