import { formatPrice } from '@/lib/format';
import type { Order } from '@/types';

export function OrderSummary({ order }: { order: Order }) {
  return (
    <section
      aria-labelledby='order-summary-title'
      className='rounded-2xl border bg-card p-6 shadow-soft'
    >
      <h2 id='order-summary-title' className='text-lg font-semibold'>
        Order Summary
      </h2>
      <dl className='mt-5 space-y-3 text-sm'>
        <div className='flex items-center justify-between'>
          <dt className='text-muted-foreground'>Subtotal</dt>
          <dd className='font-medium'>{formatPrice(order.total)}</dd>
        </div>
        <div className='flex items-center justify-between'>
          <dt className='text-muted-foreground'>Est. Sales Tax</dt>
          <dd className='font-medium'>{formatPrice(order.totalTax)}</dd>
        </div>
        <div className='flex items-center justify-between'>
          <dt className='text-muted-foreground'>Shipping & Handling</dt>
          <dd className='font-medium text-success'>Free</dd>
        </div>
        <div className='flex items-center justify-between border-t pt-4 text-base'>
          <dt className='font-semibold'>Total</dt>
          <dd className='font-semibold'>{formatPrice(order.totalWithTax)}</dd>
        </div>
      </dl>
    </section>
  );
}
