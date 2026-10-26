import type { Metadata } from 'next';

import { AccountDetailsView } from '@/components/account/account-details-view';

// The dashboard layout's title template does not apply to the page of its own segment.
export const metadata: Metadata = {
  title: { absolute: 'Account Details | Dashboard | Marketlane' }
};

export default function AccountPage() {
  return <AccountDetailsView />;
}
