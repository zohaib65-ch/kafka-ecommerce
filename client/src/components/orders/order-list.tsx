import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { ProductImage } from '@/components/shared/product-image';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate, formatPrice } from '@/lib/format';
import type { Order } from '@/types';

export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className='space-y-3'>
      {orders.map(order => {
        const first = order.products?.[0];
        const itemCount = order.products?.length ?? 0;

        return (
          <li key={order._id}>
            <Link
              href={`/order/${order._id}`}
              className='group flex items-center gap-4 rounded-2xl border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-soft focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:p-5'
            >
              <ProductImage
                product={first?.product ?? {}}
                sizes='80px'
                className='size-16 shrink-0 rounded-xl border sm:size-20'
              />
              <div className='grid min-w-0 flex-1 gap-1.5 text-sm sm:grid-cols-[1fr_auto] sm:items-center sm:gap-x-6'>
                <div className='min-w-0 space-y-1'>
                  <p className='flex flex-wrap items-center gap-x-2 gap-y-1'>
                    <span className='text-muted-foreground'>Order #</span>
                    <span className='truncate font-mono text-xs font-medium sm:text-sm'>
                      {order._id}
                    </span>
                  </p>
                  <p className='text-muted-foreground'>
                    Ordered on{' '}
                    <span className='font-medium text-foreground'>
                      {formatDate(order.created)}
                    </span>
                    {itemCount > 1 && ` · ${itemCount} items`}
                  </p>
                </div>
                <div className='flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1.5'>
                  {first ? (
                    <StatusBadge status={first.status} />
                  ) : (
                    <StatusBadge status='Unavailable' />
                  )}
                  <p className='font-semibold'>
                    {formatPrice(order.totalWithTax ?? 0)}
                  </p>
                </div>
              </div>
              <ChevronRight
                className='size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5'
                aria-hidden='true'
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
