import type { Metadata } from 'next';

import { EditProductPage } from '@/components/admin/edit-product-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Edit Product' };

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoleGate roles={[ROLES.Admin, ROLES.Merchant]}>
      <EditProductPage id={id} />
    </RoleGate>
  );
}
