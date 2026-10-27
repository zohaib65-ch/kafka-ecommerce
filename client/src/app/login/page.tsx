import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';
import { TextLink } from '@/components/auth/text-link';
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
        description='Pick up where you left off: your orders, wishlist and account.'
        footer={
          <p>
            New to Marketlane?{' '}
            <TextLink href='/register'>Create an account</TextLink>
          </p>
        }
      >
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}
