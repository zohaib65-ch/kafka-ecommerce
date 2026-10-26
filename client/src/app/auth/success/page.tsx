import type { Metadata } from 'next';

import { AuthSuccess } from '@/components/auth/auth-success';

// The OAuth token arrives in the query string: keep this page out of indexes and Referer headers.
export const metadata: Metadata = {
  title: 'Signing you in',
  robots: { index: false, follow: false },
  referrer: 'no-referrer'
};

export default function AuthSuccessPage() {
  return <AuthSuccess />;
}
