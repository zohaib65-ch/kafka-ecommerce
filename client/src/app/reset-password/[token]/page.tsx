import type { Metadata } from 'next';

import { ResetPasswordView } from '@/components/auth/reset-password-view';

// The reset token is part of the URL: keep it out of search indexes and Referer headers.
export const metadata: Metadata = {
  title: 'Reset Password',
  robots: { index: false, follow: false },
  referrer: 'no-referrer'
};

export default async function ResetPasswordPage({
  params
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <ResetPasswordView token={token} />;
}
