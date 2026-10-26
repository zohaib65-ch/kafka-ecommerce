'use client';

import Link from 'next/link';
import { ChevronDown, Star } from 'lucide-react';

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
        <Link href={`/product/${item.product.slug}`}>
          <Star /> Review Product
        </Link>
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
    <section aria-labelledby='order-items-title' className='space-y-4'>
      <h2 id='order-items-title' className='text-lg font-semibold'>
        Order Items
      </h2>
      <ul className='space-y-3'>
        {order.products.map(item => (
          <li
            key={item._id}
            className='flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-soft sm:p-5'
          >
            <div className='flex items-start gap-4'>
              <ProductImage
                product={item.product ?? {}}
                sizes='96px'
                className='size-20 shrink-0 rounded-xl border sm:size-24'
              />
              <div className='min-w-0 flex-1 space-y-2'>
                {item.product ? (
                  <>
                    <Link
                      href={`/product/${item.product.slug}`}
                      className='line-clamp-2 leading-snug font-medium hover:text-primary'
                    >
                      {item.product.name}
                    </Link>
                    <p className='text-sm text-muted-foreground'>
                      {formatPrice(item.purchasePrice || item.product.price)}
                    </p>
                  </>
                ) : (
                  <p className='font-medium'>Not Available</p>
                )}
                <StatusBadge status={item.status} />
              </div>
              <dl className='hidden shrink-0 gap-8 text-right text-sm sm:flex'>
                <div>
                  <dt className='text-muted-foreground'>Quantity</dt>
                  <dd className='mt-1 font-medium'>{item.quantity}</dd>
                </div>
                <div>
                  <dt className='text-muted-foreground'>Total Price</dt>
                  <dd className='mt-1 font-semibold'>
                    {formatPrice(item.totalPrice)}
                  </dd>
                </div>
              </dl>
            </div>

            <dl className='flex justify-between text-sm sm:hidden'>
              <div className='flex gap-1.5'>
                <dt className='text-muted-foreground'>Quantity</dt>
                <dd className='font-medium'>{item.quantity}</dd>
              </div>
              <div className='flex gap-1.5'>
                <dt className='text-muted-foreground'>Total Price</dt>
                <dd className='font-semibold'>
                  {formatPrice(item.totalPrice)}
                </dd>
              </div>
            </dl>

            {item.product && item.status !== CART_ITEM_STATUS.Cancelled && (
              <div className='flex justify-end border-t pt-3'>
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
