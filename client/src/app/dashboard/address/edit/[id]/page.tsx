import type { Metadata } from 'next';

import { EditAddressView } from '@/components/account/edit-address-view';

export const metadata: Metadata = { title: 'Edit Address' };

export default async function EditAddressPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditAddressView id={id} />;
}
