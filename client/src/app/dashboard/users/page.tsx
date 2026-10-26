import type { Metadata } from 'next';

import { UsersPage } from '@/components/admin/users-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Users' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <UsersPage />
    </RoleGate>
  );
}
