'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAppSelector } from '@/store/hooks';

import { PageLoader } from './loading';

/**
 * Renders children only for signed-in users. The session lives in localStorage, so the decision
 * waits until the client has read it (`authentication.initialized`) before redirecting to /login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const initialized = useAppSelector(state => state.authentication.initialized);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );

  useEffect(() => {
    if (initialized && !authenticated) router.replace('/login');
  }, [initialized, authenticated, router]);

  if (!initialized || !authenticated) return <PageLoader />;

  return <>{children}</>;
}

/** For login / signup style pages: signed-in users are sent to their dashboard instead. */
export function GuestOnly({
  children,
  redirectTo = '/dashboard'
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const initialized = useAppSelector(state => state.authentication.initialized);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );

  useEffect(() => {
    if (initialized && authenticated) router.replace(redirectTo);
  }, [initialized, authenticated, redirectTo, router]);

  if (!initialized || authenticated) return <PageLoader />;

  return <>{children}</>;
}
