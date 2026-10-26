import type { Metadata } from 'next';

import { CategoriesPage } from '@/components/admin/categories-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Categories' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <CategoriesPage />
    </RoleGate>
  );
}
