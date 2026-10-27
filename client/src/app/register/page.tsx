import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/components/auth/register-form';
import { TextLink } from '@/components/auth/text-link';
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
        description='An account lets you track your orders and keep a wishlist.'
        footer={
          <p>
            Already have an account?{' '}
            <TextLink href='/login'>Back to login</TextLink>
          </p>
        }
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
