import { formatPrice } from '@/lib/format';
import type { Order } from '@/types';

export function OrderSummary({ order }: { order: Order }) {
  return (
    <section
      aria-labelledby='order-summary-title'
      className='section-rule pt-4'
    >
      <h2 id='order-summary-title' className='text-3xl'>
        Order Summary
      </h2>
      <dl className='mt-5 text-sm'>
        <div className='flex items-center justify-between border-b py-3'>
          <dt className='text-muted-foreground'>Subtotal</dt>
          <dd className='tabular font-medium'>{formatPrice(order.total)}</dd>
        </div>
        <div className='flex items-center justify-between border-b py-3'>
          <dt className='text-muted-foreground'>Est. Sales Tax</dt>
          <dd className='tabular font-medium'>{formatPrice(order.totalTax)}</dd>
        </div>
        <div className='flex items-center justify-between border-b py-3'>
          <dt className='text-muted-foreground'>Shipping & Handling</dt>
          <dd className='font-medium'>Free</dd>
        </div>
        <div className='flex items-baseline justify-between pt-4'>
          <dt className='font-heading text-xl font-semibold uppercase'>
            Total
          </dt>
          <dd className='tabular font-heading text-4xl leading-none font-semibold'>
            {formatPrice(order.totalWithTax)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
