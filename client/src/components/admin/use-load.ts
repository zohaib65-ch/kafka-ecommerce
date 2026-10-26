'use client';

import { useEffect, useState } from 'react';

/**
 * Runs `load` when it changes (memoize it with useCallback, keyed by what it loads) and reports
 * whether the CURRENT load has finished, so pages show a loader instead of flashing an empty state.
 */
export function useLoad(load: () => Promise<unknown>): boolean {
  const [loadedFor, setLoadedFor] = useState<(() => Promise<unknown>) | null>(
    null
  );

  useEffect(() => {
    let active = true;
    load().finally(() => {
      if (active) setLoadedFor(() => load);
    });
    return () => {
      active = false;
    };
  }, [load]);

  return loadedFor === load;
}
