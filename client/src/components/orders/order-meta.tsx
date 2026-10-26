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
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
          Order Details
        </h1>
        <Button variant='ghost' size='sm' onClick={onBack}>
          <ArrowLeft /> Back to orders
        </Button>
      </div>

      <div className='flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-6'>
        <dl className='grid min-w-0 gap-x-10 gap-y-3 text-sm sm:grid-cols-[auto_1fr]'>
          <dt className='text-muted-foreground'>Order ID</dt>
          <dd className='truncate font-mono font-medium'>{order._id}</dd>
          <dt className='text-muted-foreground'>Order Date</dt>
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
  );
}
