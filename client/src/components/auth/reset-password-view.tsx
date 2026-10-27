'use client';

import { GuestOnly } from '@/components/shared/auth-guard';
import { useAppDispatch } from '@/store/hooks';
import { resetPassword } from '@/store/reset-password/actions';

import { AuthShell } from './auth-shell';
import { ResetPasswordForm } from './reset-password-form';

export function ResetPasswordView({ token }: { token: string }) {
  const dispatch = useAppDispatch();

  return (
    <GuestOnly>
      <AuthShell
        title='Reset Password'
        description='Choose a new password for your account.'
      >
        <ResetPasswordForm
          mode='token'
          onSubmit={values => dispatch(resetPassword(token, values))}
        />
      </AuthShell>
    </GuestOnly>
  );
}
