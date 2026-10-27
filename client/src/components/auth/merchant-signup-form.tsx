'use client';

import {
  Form,
  PasswordField,
  SubmitButton,
  TextField,
  useZodForm
} from '@/components/forms';
import {
  merchantSignupDefaultValues,
  merchantSignupSchema
} from '@/lib/validations/merchant';
import { useAppDispatch } from '@/store/hooks';
import { merchantSignUp } from '@/store/merchant/actions';

type MerchantSignupFormProps = {
  token: string;
  /** Email from the invite link (`?email=`); the field stays editable, as before. */
  defaultEmail?: string;
};

export function MerchantSignupForm({
  token,
  defaultEmail = ''
}: MerchantSignupFormProps) {
  const dispatch = useAppDispatch();
  const form = useZodForm(merchantSignupSchema, {
    defaultValues: { ...merchantSignupDefaultValues, email: defaultEmail }
  });

  return (
    <Form
      form={form}
      onSubmit={async values => {
        // On success the thunk signs out any session and sends the new merchant to /login.
        await dispatch(merchantSignUp(token, values));
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
      <div className='grid gap-5 sm:grid-cols-2'>
        <TextField
          control={form.control}
          name='firstName'
          label='First Name'
          placeholder='First name'
          autoComplete='given-name'
        />
        <TextField
          control={form.control}
          name='lastName'
          label='Last Name'
          placeholder='Last name'
          autoComplete='family-name'
        />
      </div>
      <PasswordField
        control={form.control}
        name='password'
        label='Password'
        description='Use at least 6 characters.'
        autoComplete='new-password'
      />
      <SubmitButton
        size='lg'
        className='w-full'
        loading={form.formState.isSubmitting}
      >
        Create account
      </SubmitButton>
    </Form>
  );
}
