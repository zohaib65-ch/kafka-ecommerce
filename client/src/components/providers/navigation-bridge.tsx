'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { registerRouter } from '@/lib/navigation';

// Lets Redux thunks navigate (navigation.push / replace / back) through the Next.js router.
export function NavigationBridge() {
  const router = useRouter();

  useEffect(() => {
    registerRouter(router);
    return () => registerRouter(null);
  }, [router]);

  return null;
}
