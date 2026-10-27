'use client';

import {
  Form,
  PasswordField,
  SubmitButton,
  TextField,
  useZodForm
} from '@/components/forms';
import { signupDefaultValues, signupSchema } from '@/lib/validations/auth';
import { useAppDispatch } from '@/store/hooks';
import { signUp } from '@/store/signup/actions';

import { FormDivider } from './form-divider';
import { SocialAuthButtons } from './social-auth-buttons';

export function RegisterForm() {
  const dispatch = useAppDispatch();
  const form = useZodForm(signupSchema, { defaultValues: signupDefaultValues });

  return (
    <>
      <SocialAuthButtons mode='register' />
      <FormDivider>or use your email</FormDivider>
      <Form
        form={form}
        onSubmit={async values => {
          // On success the page redirects as soon as `authentication.authenticated` flips.
          await dispatch(signUp(values));
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
          Sign Up
        </SubmitButton>
      </Form>
    </>
  );
}
