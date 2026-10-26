import type { Metadata } from 'next';

import { AddBrandPage } from '@/components/admin/add-brand-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Add Brand' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <AddBrandPage />
    </RoleGate>
  );
}
