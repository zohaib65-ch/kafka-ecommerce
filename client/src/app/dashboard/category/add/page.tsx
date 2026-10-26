import type { Metadata } from 'next';

import { AddCategoryPage } from '@/components/admin/add-category-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Add Category' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <AddCategoryPage />
    </RoleGate>
  );
}
