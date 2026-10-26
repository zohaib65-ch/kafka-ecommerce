import type { Metadata } from 'next';
import { Store } from 'lucide-react';

import { AuthShell } from '@/components/auth/auth-shell';
import { MerchantSignupForm } from '@/components/auth/merchant-signup-form';

// The invite token is part of the URL: keep it out of search indexes and Referer headers.
export const metadata: Metadata = {
  title: 'Complete Sign Up',
  robots: { index: false, follow: false },
  referrer: 'no-referrer'
};

export default async function MerchantSignupPage({
  params,
  searchParams
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ email?: string | string[] }>;
}) {
  const { token } = await params;
  const { email } = await searchParams;

  return (
    <AuthShell
      title='Complete Sign Up'
      description={
        <>
          <Store
            className='mr-1.5 mb-0.5 inline size-4 text-primary'
            aria-hidden='true'
          />
          Your seller application was accepted. Create your merchant account to
          get started.
        </>
      }
    >
      <MerchantSignupForm
        token={token}
        defaultEmail={Array.isArray(email) ? email[0] : email}
      />
    </AuthShell>
  );
}
