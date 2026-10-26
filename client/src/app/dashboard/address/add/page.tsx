import type { Metadata } from 'next';

import { AddAddressView } from '@/components/account/add-address-view';

export const metadata: Metadata = { title: 'Add Address' };

export default function AddAddressPage() {
  return <AddAddressView />;
}
