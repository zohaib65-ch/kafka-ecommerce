'use client';

import { useEffect } from 'react';

import { PageLoader } from '@/components/shared/loading';
import { RequireAuth } from '@/components/shared/auth-guard';
import { isDisabledMerchantAccount } from '@/lib/app-utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProfile } from '@/store/account/actions';

import { DashboardNav } from './dashboard-nav';
import { DisabledMerchantAccount } from './disabled-merchant-account';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.account.user);
  const isLoading = useAppSelector(state => state.account.isLoading);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (isDisabledMerchantAccount(user))
    return <DisabledMerchantAccount user={user} />;

  // The role decides which pages exist, so wait for the profile before rendering them.
  if (isLoading && !user._id)
    return <PageLoader label='Loading your dashboard' />;

  return (
    <div className='grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]'>
      <DashboardNav />
      <div className='min-w-0'>{children}</div>
    </div>
  );
}

/** Auth guard + profile loading + role-aware navigation for everything under /dashboard. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className='container-page py-8 lg:py-12'>
        <DashboardContent>{children}</DashboardContent>
      </div>
    </RequireAuth>
  );
}
