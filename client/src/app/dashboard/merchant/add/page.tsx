import type { Metadata } from 'next';

import { AddMerchantPage } from '@/components/admin/add-merchant-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Add Merchant' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <AddMerchantPage />
    </RoleGate>
  );
}
