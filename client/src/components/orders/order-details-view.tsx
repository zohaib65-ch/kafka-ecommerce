'use client';

import { useRouter } from 'next/navigation';

import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  cancelOrder,
  fetchOrder,
  updateOrderItemStatus
} from '@/store/order/actions';
import type { CartItemStatus } from '@/types';

import { OrderItems } from './order-items';
import { OrderMeta } from './order-meta';
import { OrderSummary } from './order-summary';
import { useLoadedFor } from './use-loaded-for';

export function OrderDetailsView({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loaded = useLoadedFor(id, fetchOrder);
  const order = useAppSelector(state => state.order.order);
  const user = useAppSelector(state => state.account.user);

  // Coming from the "order complete" page there is no meaningful history to go back to.
  const handleBack = () => {
    if (window.location.search.includes('success')) {
      router.push('/dashboard/orders');
    } else {
      router.back();
    }
  };

  if (!loaded) return <PageLoader label='Loading order' />;

  if (order?._id !== id) {
    return (
      <EmptyState
        message='No order found.'
        description='This order does not exist or you do not have access to it.'
        action={
          <Button onClick={() => router.push('/dashboard/orders')}>
            Go to my orders
          </Button>
        }
      />
    );
  }

  return (
    <div className='space-y-12'>
      <OrderMeta
        order={order}
        onBack={handleBack}
        onCancelOrder={() => dispatch(cancelOrder())}
      />
      <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start'>
        <OrderItems
          order={order}
          user={user}
          onUpdateStatus={(itemId: string, status: CartItemStatus) =>
            dispatch(updateOrderItemStatus(itemId, status))
          }
        />
        <div className='lg:sticky lg:top-28'>
          <OrderSummary order={order} />
        </div>
      </div>
    </div>
  );
}
