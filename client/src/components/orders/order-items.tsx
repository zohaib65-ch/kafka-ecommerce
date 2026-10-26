'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { ProductImage } from '@/components/shared/product-image';
import { StatusBadge } from '@/components/shared/status-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { CART_ITEM_STATUS, ROLES } from '@/lib/constants';
import { formatPrice } from '@/lib/format';
import type { CartItemStatus, Order, OrderItem, User } from '@/types';

type OrderItemsProps = {
  order: Order;
  user: User;
  onUpdateStatus: (itemId: string, status: CartItemStatus) => void;
};

const STATUSES = Object.values(CART_ITEM_STATUS) as CartItemStatus[];

function ItemAction({
  item,
  isAdmin,
  onUpdateStatus
}: {
  item: OrderItem;
  isAdmin: boolean;
  onUpdateStatus: OrderItemsProps['onUpdateStatus'];
}) {
  if (!item.product) return null;

  if (item.status === CART_ITEM_STATUS.Delivered) {
    return (
      <Button asChild variant='outline' size='sm'>
        <Link href={`/product/${item.product.slug}`}>Review Product</Link>
      </Button>
    );
  }

  if (item.status === CART_ITEM_STATUS.Cancelled) return null;

  if (isAdmin) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            aria-label={`Change status of ${item.product.name}`}
          >
            {item.status} <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuRadioGroup
            value={item.status}
            onValueChange={status =>
              onUpdateStatus(item._id, status as CartItemStatus)
            }
          >
            {STATUSES.map(status => (
              <DropdownMenuRadioItem key={status} value={status}>
                {status}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <ConfirmDialog
      trigger={
        <Button variant='outline' size='sm'>
          Cancel
        </Button>
      }
      title='Cancel this item?'
      description={`Are you sure you want to cancel ${item.product.name}?`}
      confirmLabel='Confirm Cancel'
      cancelLabel='Keep item'
      onConfirm={() => onUpdateStatus(item._id, CART_ITEM_STATUS.Cancelled)}
    />
  );
}

export function OrderItems({ order, user, onUpdateStatus }: OrderItemsProps) {
  const isAdmin = user.role === ROLES.Admin;

  return (
    <section aria-labelledby='order-items-title'>
      <h2 id='order-items-title' className='section-rule pt-4 text-3xl'>
        Order Items
      </h2>
      <ul className='mt-4 divide-y border-y'>
        {order.products.map(item => (
          <li
            key={item._id}
            className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 py-5 sm:grid-cols-[auto_minmax(0,1fr)_auto]'
          >
            <ProductImage
              product={item.product ?? {}}
              sizes='96px'
              className='size-20 shrink-0 border sm:size-24'
            />
            <div className='min-w-0 space-y-2'>
              {item.product ? (
                <>
                  <Link
                    href={`/product/${item.product.slug}`}
                    className='line-clamp-2 text-lg leading-snug font-semibold hover:underline'
                  >
                    {item.product.name}
                  </Link>
                  <p className='tabular text-sm text-muted-foreground'>
                    {formatPrice(item.purchasePrice || item.product.price)} each
                  </p>
                </>
              ) : (
                <p className='text-lg font-semibold'>Not Available</p>
              )}
              <StatusBadge status={item.status} />
            </div>

            <dl className='col-span-2 flex items-baseline justify-between gap-6 border-t pt-3 text-sm sm:col-span-1 sm:block sm:border-t-0 sm:pt-0 sm:text-right'>
              <div className='flex gap-2 sm:block'>
                <dt className='meta'>Quantity</dt>
                <dd className='tabular font-medium'>{item.quantity}</dd>
              </div>
              <div className='flex gap-2 sm:mt-3 sm:block'>
                <dt className='meta'>Total Price</dt>
                <dd className='tabular font-heading text-2xl leading-none font-semibold'>
                  {formatPrice(item.totalPrice)}
                </dd>
              </div>
            </dl>

            {item.product && item.status !== CART_ITEM_STATUS.Cancelled && (
              <div className='col-span-2 flex justify-end sm:col-span-3'>
                <ItemAction
                  item={item}
                  isAdmin={isAdmin}
                  onUpdateStatus={onUpdateStatus}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
