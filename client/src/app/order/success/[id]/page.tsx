import type { Metadata } from 'next';

import { OrderSuccessView } from '@/components/orders/order-success-view';
import { RequireAuth } from '@/components/shared/auth-guard';

export const metadata: Metadata = {
  title: 'Order Complete',
  robots: { index: false }
};

export default async function OrderSuccessPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className='container-page py-12 lg:py-20'>
      <RequireAuth>
        <OrderSuccessView id={id} />
      </RequireAuth>
    </div>
  );
}
