'use client';

import { ArrowLeft } from 'lucide-react';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { Button } from '@/components/ui/button';
import { CART_ITEM_STATUS } from '@/lib/constants';
import { formatDate } from '@/lib/format';
import type { Order } from '@/types';

type OrderMetaProps = {
  order: Order;
  onBack: () => void;
  onCancelOrder: () => void;
};

export function OrderMeta({ order, onBack, onCancelOrder }: OrderMetaProps) {
  // An order can be cancelled until one of its items has been delivered.
  const canCancel = !order.products.some(
    item => item.status === CART_ITEM_STATUS.Delivered
  );

  return (
    <div>
      <Button variant='link' size='sm' className='mb-6 px-0' onClick={onBack}>
        <ArrowLeft /> Back to orders
      </Button>

      <div className='section-rule pt-5'>
        <h1 className='text-5xl sm:text-6xl'>Order Details</h1>

        <div className='mt-6 flex flex-col gap-5 border-y py-5 sm:flex-row sm:items-center sm:justify-between'>
          <dl className='grid min-w-0 gap-x-10 gap-y-3 sm:grid-cols-[auto_1fr] sm:items-baseline'>
            <dt className='meta'>Order ID</dt>
            <dd className='truncate font-mono text-sm font-medium'>
              {order._id}
            </dd>
            <dt className='meta'>Order Date</dt>
            <dd className='font-medium'>{formatDate(order.created)}</dd>
          </dl>
          {canCancel && (
            <ConfirmDialog
              trigger={<Button variant='outline'>Cancel Order</Button>}
              title='Cancel this order?'
              description='The whole order will be cancelled. This action cannot be undone.'
              confirmLabel='Cancel order'
              cancelLabel='Keep order'
              onConfirm={onCancelOrder}
            />
          )}
        </div>
      </div>
    </div>
  );
}
