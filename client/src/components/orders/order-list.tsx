import Link from 'next/link';

import { ProductImage } from '@/components/shared/product-image';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatPrice } from '@/lib/format';
import type { Order } from '@/types';

// Thumbnail | order id | date | items | status | total. Collapses to two lines below md.
const ROW_GRID =
  'grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 md:grid-cols-[3.5rem_minmax(0,1.6fr)_9.5rem_4.5rem_7.5rem_6.5rem]';

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <div>
      <div
        aria-hidden='true'
        className={`${ROW_GRID} meta hidden border-b border-foreground pb-2 md:grid`}
      >
        <span />
        <span>Order</span>
        <span>Date</span>
        <span>Items</span>
        <span>Status</span>
        <span className='text-right'>Total</span>
      </div>

      <ul className='divide-y border-b md:border-b-0'>
        {orders.map(order => {
          const first = order.products?.[0];
          const itemCount = order.products?.length ?? 0;

          return (
            <li key={order._id}>
              <Link
                href={`/order/${order._id}`}
                className={`${ROW_GRID} group py-4 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 md:-mx-3 md:px-3`}
              >
                <ProductImage
                  product={first?.product ?? {}}
                  sizes='56px'
                  className='row-span-2 size-14 border md:row-span-1'
                />
                <span className='min-w-0'>
                  <span className='meta block md:hidden'>Order</span>
                  <span className='block truncate font-mono text-sm font-medium group-hover:underline'>
                    {order._id}
                  </span>
                </span>
                <span className='tabular text-right font-semibold md:order-last'>
                  {formatPrice(order.totalWithTax ?? 0)}
                </span>
                <span className='col-span-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground md:contents'>
                  <span className='md:text-foreground'>
                    {formatDate(order.created)}
                  </span>
                  <span className='md:text-foreground'>
                    <span className='md:hidden'>{itemCount} items · </span>
                    <span className='hidden md:inline'>{itemCount}</span>
                  </span>
                  {first ? (
                    <StatusBadge status={first.status} />
                  ) : (
                    <StatusBadge status='Unavailable' />
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
