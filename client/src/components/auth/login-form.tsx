'use client';

import Link from 'next/link';

import {
  Form,
  PasswordField,
  SubmitButton,
  TextField,
  useZodForm
} from '@/components/forms';
import { loginDefaultValues, loginSchema } from '@/lib/validations/auth';
import { useAppDispatch } from '@/store/hooks';
import { login } from '@/store/login/actions';

import { FormDivider } from './form-divider';
import { SocialAuthButtons } from './social-auth-buttons';

export function LoginForm() {
  const dispatch = useAppDispatch();
  const form = useZodForm(loginSchema, { defaultValues: loginDefaultValues });

  return (
    <>
      <SocialAuthButtons mode='login' />
      <FormDivider>or login with email</FormDivider>
      <Form
        form={form}
        onSubmit={async values => {
          // On success the page redirects as soon as `authentication.authenticated` flips.
          await dispatch(login(values));
        }}
      >
        <TextField
          control={form.control}
          name='email'
          type='email'
          label='Email Address'
          placeholder='Please Enter Your Email'
          autoComplete='email'
        />
        <div className='space-y-2'>
          <PasswordField
            control={form.control}
            name='password'
            label='Password'
            placeholder='Please Enter Your Password'
            autoComplete='current-password'
          />
          <div className='flex justify-end'>
            <Link
              href='/forgot-password'
              className='text-sm font-medium text-primary hover:underline'
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <SubmitButton
          size='lg'
          className='w-full'
          loading={form.formState.isSubmitting}
        >
          Login
        </SubmitButton>
      </Form>
    </>
  );
}
