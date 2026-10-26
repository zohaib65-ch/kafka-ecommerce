import type { Metadata } from 'next';

import { OrdersListPage } from '@/components/orders/orders-list-page';

export const metadata: Metadata = { title: 'Your Orders' };

export default function OrdersPage() {
  return <OrdersListPage variant='mine' />;
}
