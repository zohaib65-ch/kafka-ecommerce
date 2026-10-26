import type { Metadata } from 'next';

import { EditBrandPage } from '@/components/admin/edit-brand-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Edit Brand' };

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoleGate roles={[ROLES.Admin, ROLES.Merchant]}>
      <EditBrandPage id={id} />
    </RoleGate>
  );
}
