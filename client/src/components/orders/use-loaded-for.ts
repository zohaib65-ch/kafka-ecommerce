'use client';

import { useEffect, useState } from 'react';

import type { AppThunk } from '@/store';
import { useAppDispatch } from '@/store/hooks';

/**
 * Dispatches `load(id)` whenever `id` changes and reports whether the data for the CURRENT id has
 * arrived. Lets pages tell "still loading" from "not found" without keeping stale data on screen
 * (the store keeps the last fetched entity, which may belong to another id).
 * `load` must be a stable function (an imported thunk creator).
 */
export function useLoadedFor(
  id: string,
  load: (id: string) => AppThunk<Promise<unknown>>
) {
  const dispatch = useAppDispatch();
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    dispatch(load(id)).finally(() => {
      if (active) setLoadedId(id);
    });
    return () => {
      active = false;
    };
  }, [dispatch, id, load]);

  return loadedId === id;
}
