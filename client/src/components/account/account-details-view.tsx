'use client';

import { useMemo } from 'react';

import { Form, SubmitButton, TextField, useZodForm } from '@/components/forms';
import { SubPage } from '@/components/dashboard/sub-page';
import { EMAIL_PROVIDER } from '@/lib/constants';
import { profileSchema, profileToFormValues } from '@/lib/validations/account';
import { updateProfile } from '@/store/account/actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

import { UserRoleBadge } from './user-role-badge';

export function AccountDetailsView() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.account.user);

  // `values` keeps the form in sync when the profile (re)loads; edits in progress are kept.
  const values = useMemo(
    () => profileToFormValues(user),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only the editable fields matter
    [user.firstName, user.lastName, user.phoneNumber]
  );
  const form = useZodForm(profileSchema, {
    values,
    resetOptions: { keepDirtyValues: true }
  });

  return (
    <SubPage
      title='Account Details'
      description='Your name, phone number and sign-in details.'
    >
      <div className='divide-y border-y'>
        <section className='grid gap-4 py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10'>
          <h2 className='text-3xl'>Sign-in</h2>
          <dl className='grid max-w-xl gap-x-6 gap-y-4 sm:grid-cols-[8rem_1fr]'>
            <dt className='meta self-center'>
              {user.provider === EMAIL_PROVIDER.Email ? 'Email' : 'Logged in with'}
            </dt>
            <dd className='min-w-0 truncate font-medium'>
              {user.provider === EMAIL_PROVIDER.Email
                ? user.email
                : user.provider}
            </dd>
            <dt className='meta self-center'>Role</dt>
            <dd>
              <UserRoleBadge role={user.role} />
            </dd>
          </dl>
        </section>

        <section className='grid gap-4 py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10'>
          <h2 className='text-3xl'>Personal details</h2>
          <Form
            form={form}
            onSubmit={async profile => {
              await dispatch(updateProfile(profile));
            }}
            className='max-w-xl space-y-5'
          >
            <div className='grid gap-5 sm:grid-cols-2'>
              <TextField
                control={form.control}
                name='firstName'
                label='First Name'
                placeholder='Please Enter Your First Name'
                autoComplete='given-name'
              />
              <TextField
                control={form.control}
                name='lastName'
                label='Last Name'
                placeholder='Please Enter Your Last Name'
                autoComplete='family-name'
              />
            </div>
            <TextField
              control={form.control}
              name='phoneNumber'
              type='tel'
              label='Phone Number'
              placeholder='Please Enter Your Phone Number'
              autoComplete='tel'
            />
            <SubmitButton loading={form.formState.isSubmitting}>
              Save changes
            </SubmitButton>
          </Form>
        </section>
      </div>
    </SubPage>
  );
}
