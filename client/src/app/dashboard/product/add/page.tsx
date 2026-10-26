import type { Metadata } from 'next';

import { AddProductPage } from '@/components/admin/add-product-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Add Product' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin, ROLES.Merchant]}>
      <AddProductPage />
    </RoleGate>
  );
}
