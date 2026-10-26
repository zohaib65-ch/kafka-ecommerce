import type { Metadata } from 'next';

import { RoleGate } from '@/components/dashboard/role-gate';
import { OrdersListPage } from '@/components/orders/orders-list-page';
import { ROLES } from '@/lib/constants';

export const metadata: Metadata = { title: 'Customer Orders' };

export default function CustomerOrdersPage() {
  return (
    <RoleGate roles={[ROLES.Admin]}>
      <OrdersListPage variant='customers' />
    </RoleGate>
  );
}
