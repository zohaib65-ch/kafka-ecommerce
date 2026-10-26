import type { Metadata } from 'next';

import { EditCategoryPage } from '@/components/admin/edit-category-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Edit Category' };

export default async function Page({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RoleGate roles={[ROLES.Admin]}>
      <EditCategoryPage id={id} />
    </RoleGate>
  );
}
