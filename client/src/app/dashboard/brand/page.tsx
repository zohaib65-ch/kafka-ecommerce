import type { Metadata } from 'next';

import { BrandsPage } from '@/components/admin/brands-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Brands' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin, ROLES.Merchant]}>
      <BrandsPage />
    </RoleGate>
  );
}
