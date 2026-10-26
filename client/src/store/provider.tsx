'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';

import { makeStore } from './index';

// The store is created once per mount (never at module level, see makeStore).
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
