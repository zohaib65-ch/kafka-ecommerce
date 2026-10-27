import type { Metadata } from 'next';

import { AuthShell } from '@/components/auth/auth-shell';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';
import { TextLink } from '@/components/auth/text-link';
import { GuestOnly } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Request a link to reset your Marketlane password.'
};

export default function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <AuthShell
        title='Forgot Password'
        description='Enter the email address of your account and we will send you a link to reset your password.'
        footer={
          <p>
            Remembered it? <TextLink href='/login'>Back to login</TextLink>
          </p>
        }
      >
        <ForgotPasswordForm />
      </AuthShell>
    </GuestOnly>
  );
}
