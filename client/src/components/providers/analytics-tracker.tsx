'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { initAnalytics, trackPageView } from '@/lib/analytics';

// Anonymous page view tracking for Pulseboard (see lib/analytics.ts for the privacy rules).
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
