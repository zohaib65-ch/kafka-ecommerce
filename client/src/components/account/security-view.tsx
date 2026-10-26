'use client';

import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { SubPage } from '@/components/dashboard/sub-page';
import { resetAccountPassword } from '@/store/reset-password/actions';
import { useAppDispatch } from '@/store/hooks';

export function SecurityView() {
  const dispatch = useAppDispatch();

  return (
    <SubPage
      title='Account Security'
      description='Change the password you use to log in.'
    >
      <section className='grid gap-4 border-y py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10'>
        <div>
          <h2 className='text-3xl'>Reset Password</h2>
          <p className='mt-3 text-sm text-muted-foreground'>
            Enter your current password and a new one. You will be signed out
            afterwards and can log back in with the new password.
          </p>
        </div>
        <div className='max-w-xl'>
          <ResetPasswordForm
            mode='account'
            onSubmit={values => dispatch(resetAccountPassword(values))}
          />
        </div>
      </section>
    </SubPage>
  );
}
