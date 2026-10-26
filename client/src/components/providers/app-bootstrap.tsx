'use client';

import { useEffect } from 'react';

import { CART_ITEMS } from '@/lib/constants';
import setToken, { getStoredToken } from '@/lib/token';
import { useAppDispatch } from '@/store/hooks';
import { setAuth, setAuthInitialized } from '@/store/authentication/actions';
import { fetchProfile } from '@/store/account/actions';
import { handleCart } from '@/store/cart/actions';

// Runs once on the client: restores the session and the cart from localStorage.
// The server cannot read either, so authenticated pages wait for `authentication.initialized`.
export function AppBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getStoredToken();

    if (token) {
      // authenticate api authorization
      setToken(token);
      // authenticate routes
      dispatch(setAuth());
      dispatch(fetchProfile());
    }

    dispatch(handleCart());
    dispatch(setAuthInitialized());

    // keep the cart in sync across tabs
    const handleStorage = (event: StorageEvent) => {
      if (event.key === CART_ITEMS) dispatch(handleCart());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [dispatch]);

  return null;
}
