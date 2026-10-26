import type { Metadata } from 'next';

import { MerchantsPage } from '@/components/admin/merchants-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Merchants' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <MerchantsPage />
    </RoleGate>
  );
}
