'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(min-width: 768px)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

/** True from the `md` breakpoint up (false on the server), so a list renders ONE layout, not both. */
export function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
