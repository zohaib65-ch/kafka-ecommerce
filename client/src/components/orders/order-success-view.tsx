'use client';

import Link from 'next/link';
import { CircleCheckBig, PackageX } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/loading';
import { ProductImage } from '@/components/shared/product-image';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { fetchOrder } from '@/store/order/actions';
import { useAppSelector } from '@/store/hooks';

import { useLoadedFor } from './use-loaded-for';

export function OrderSuccessView({ id }: { id: string }) {
  const loaded = useLoadedFor(id, fetchOrder);
  const order = useAppSelector(state => state.order.order);

  if (!loaded) return <PageLoader label='Loading your order' />;

  if (order?._id !== id) {
    return (
      <EmptyState
        icon={PackageX}
        message='No order found.'
        action={
          <Button asChild>
            <Link href='/shop'>Continue Shopping</Link>
          </Button>
        }
      />
    );
  }

  const previewItems = order.products.slice(0, 4);
  const hiddenCount = order.products.length - previewItems.length;

  return (
    <div className='mx-auto max-w-xl text-center'>
      <span className='mx-auto grid size-20 place-items-center rounded-full bg-success/15 text-success'>
        <CircleCheckBig className='size-10' aria-hidden='true' />
      </span>
      <h1 className='mt-6 text-3xl font-semibold tracking-tight sm:text-4xl'>
        Thank you for your order.
      </h1>
      <p className='mt-4 text-muted-foreground'>
        Order{' '}
        <Link
          href={`/order/${order._id}?success`}
          className='font-mono font-medium break-all text-primary underline-offset-4 hover:underline'
        >
          #{order._id}
        </Link>{' '}
        is complete.
      </p>
      <p className='mt-1 text-muted-foreground'>
        A confirmation email will be sent to you shortly.
      </p>

      <div className='mt-8 rounded-2xl border bg-card p-5 text-left shadow-soft'>
        <ul className='flex items-center gap-3'>
          {previewItems.map(item => (
            <li key={item._id}>
              <ProductImage
                product={item.product ?? {}}
                sizes='64px'
                className='size-16 rounded-xl border'
              />
            </li>
          ))}
          {hiddenCount > 0 && (
            <li className='grid size-16 place-items-center rounded-xl bg-muted text-sm font-medium text-muted-foreground'>
              +{hiddenCount}
            </li>
          )}
        </ul>
        <dl className='mt-5 space-y-2 border-t pt-4 text-sm'>
          <div className='flex justify-between'>
            <dt className='text-muted-foreground'>Items</dt>
            <dd className='font-medium'>{order.products.length}</dd>
          </div>
          <div className='flex justify-between text-base'>
            <dt className='font-semibold'>Total</dt>
            <dd className='font-semibold'>{formatPrice(order.totalWithTax)}</dd>
          </div>
        </dl>
      </div>

      <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
        <Button asChild size='lg' variant='outline'>
          <Link href='/dashboard/orders'>Manage Orders</Link>
        </Button>
        <Button asChild size='lg'>
          <Link href='/shop'>Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
