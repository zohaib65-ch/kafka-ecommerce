import type { Metadata } from 'next';

import { ReviewsPage } from '@/components/admin/reviews-page';
import { RoleGate } from '@/components/dashboard/role-gate';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Reviews' };

export default function Page() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <ReviewsPage />
    </RoleGate>
  );
}
