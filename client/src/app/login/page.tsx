import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';
import { GuestOnly } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'Login',
  description:
    'Login to your Marketlane account to track orders and check out faster.'
};

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthShell
        title='Login'
        description='Welcome back. Login to manage your orders, wishlist and account.'
        footer={
          <p>
            New to Marketlane?{' '}
            <Link
              href='/register'
              className='font-medium text-primary hover:underline'
            >
              Create an account
            </Link>
          </p>
        }
      >
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}
