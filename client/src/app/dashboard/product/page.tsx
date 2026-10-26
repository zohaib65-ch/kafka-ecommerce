import type { Metadata } from 'next';

import { ProductsPage } from '@/components/admin/products-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Products' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin, ROLES.Merchant]}>
      <ProductsPage />
    </RoleGate>
  );
}
