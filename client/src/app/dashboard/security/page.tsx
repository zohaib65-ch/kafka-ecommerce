import type { Metadata } from 'next';

import { SecurityView } from '@/components/account/security-view';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Account Security' };

export default function SecurityPage() {
  return (
    <RoleGate
      roles={[ROLES.Admin, ROLES.Merchant, ROLES.Member]}
      hideForSocialProviders
    >
      <SecurityView />
    </RoleGate>
  );
}
