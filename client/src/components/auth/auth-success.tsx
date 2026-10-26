'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { PageLoader } from '@/components/shared/loading';
import { storeToken } from '@/lib/token';
import { setAuth } from '@/store/authentication/actions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

/**
 * Landing page of the Google / Facebook OAuth flow: the API redirects here with
 * `?token=Bearer <jwt>`. The token is stored, removed from the address bar, and the user continues
 * to the dashboard once `authentication.authenticated` is set.
 */
export function AuthSuccess() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(state => state.authentication.initialized);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );
  // undefined = URL not read yet; null = the URL had no token. A ref survives the dev-mode
  // double effect, so the token is not lost after it has been stripped from the URL.
  const token = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (token.current === undefined) {
      const value = new URLSearchParams(window.location.search).get('token');
      token.current = value ? value.replace('%20', ' ') : null;
      if (value)
        window.history.replaceState(null, '', window.location.pathname);
    }

    if (token.current) {
      storeToken(token.current);
      dispatch(setAuth());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!initialized) return;
    if (authenticated) router.replace('/dashboard');
    else if (!token.current) router.replace('/login');
  }, [initialized, authenticated, router]);

  return <PageLoader label='Signing you in' />;
}
