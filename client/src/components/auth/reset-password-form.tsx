'use client';

import {
  Form,
  PasswordField,
  SubmitButton,
  useZodForm
} from '@/components/forms';
import {
  accountPasswordDefaultValues,
  accountPasswordSchema,
  resetPasswordDefaultValues,
  resetPasswordSchema
} from '@/lib/validations/auth';

type ResetPasswordFormProps = {
  /**
   * 'token': set a new password from the emailed link (both fields must match).
   * 'account': change the password of the signed in user. The API calls the current password
   * `password` and the new one `confirmPassword`; the labels here say what they really are.
   */
  mode: 'token' | 'account';
  onSubmit: (values: {
    password: string;
    confirmPassword: string;
  }) => Promise<boolean>;
};

export function ResetPasswordForm({ mode, onSubmit }: ResetPasswordFormProps) {
  const isToken = mode === 'token';
  const form = useZodForm(
    isToken ? resetPasswordSchema : accountPasswordSchema,
    {
      defaultValues: isToken
        ? resetPasswordDefaultValues
        : accountPasswordDefaultValues
    }
  );

  return (
    <Form
      form={form}
      onSubmit={async values => {
        const ok = await onSubmit(values);
        if (ok) form.reset();
      }}
    >
      <div className='grid gap-5 sm:grid-cols-2'>
        <PasswordField
          control={form.control}
          name='password'
          label={isToken ? 'Password' : 'Current password'}
          autoComplete={isToken ? 'new-password' : 'current-password'}
        />
        <PasswordField
          control={form.control}
          name='confirmPassword'
          label={isToken ? 'Confirm password' : 'New password'}
          autoComplete='new-password'
        />
      </div>
      <div className='border-t pt-5'>
        <SubmitButton loading={form.formState.isSubmitting}>
          Reset Password
        </SubmitButton>
      </div>
    </Form>
  );
}
