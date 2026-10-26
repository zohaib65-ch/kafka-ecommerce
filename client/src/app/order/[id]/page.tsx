import type { Metadata } from 'next';

import { OrderDetailsView } from '@/components/orders/order-details-view';
import { RequireAuth } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'Order Details',
  robots: { index: false }
};

export default async function OrderPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='container-page max-w-5xl py-10 lg:py-14'>
      <RequireAuth>
        <OrderDetailsView id={id} />
      </RequireAuth>
    </div>
  );
}
