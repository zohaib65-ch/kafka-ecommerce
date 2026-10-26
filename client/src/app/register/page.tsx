import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';
import { GuestOnly } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'Sign Up',
  description:
    'Create a Marketlane account to track orders and save your favorites.'
};

export default function RegisterPage() {
  return (
    <GuestOnly>
      <AuthShell
        title='Sign Up'
        description='Create your account to track orders, save favorites and check out faster.'
        footer={
          <p>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-primary hover:underline'
            >
              Back to login
            </Link>
          </p>
        }
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
