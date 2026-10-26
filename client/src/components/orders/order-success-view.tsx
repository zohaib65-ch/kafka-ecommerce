'use client';

import Link from 'next/link';

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
    <div className='section-rule pt-5'>
      <p className='meta'>Order complete</p>
      <h1 className='mt-3 max-w-4xl text-[clamp(3.5rem,13vw,10rem)] leading-[0.85]'>
        Thank you for your order.
      </h1>

      <div className='mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_20rem]'>
        <div>
          <p className='text-lg'>
            Order{' '}
            <Link
              href={`/order/${order._id}?success`}
              className='tabular font-mono font-semibold break-all underline underline-offset-4 decoration-brand decoration-2'
            >
              #{order._id}
            </Link>{' '}
            is complete.
          </p>
          <p className='mt-1 text-muted-foreground'>
            A confirmation email will be sent to you shortly.
          </p>

          <ul className='mt-8 flex flex-wrap items-center gap-3'>
            {previewItems.map(item => (
              <li key={item._id}>
                <ProductImage
                  product={item.product ?? {}}
                  sizes='80px'
                  className='size-20 border'
                />
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className='grid size-20 place-items-center border bg-muted font-heading text-2xl font-semibold text-muted-foreground'>
                +{hiddenCount}
              </li>
            )}
          </ul>
        </div>

        <dl className='self-start border-y'>
          <div className='flex justify-between border-b py-3'>
            <dt className='meta self-center'>Items</dt>
            <dd className='tabular font-medium'>{order.products.length}</dd>
          </div>
          <div className='flex items-baseline justify-between py-4'>
            <dt className='font-heading text-xl font-semibold uppercase'>
              Total
            </dt>
            <dd className='tabular font-heading text-4xl leading-none font-semibold'>
              {formatPrice(order.totalWithTax)}
            </dd>
          </div>
        </dl>
      </div>

      <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
        <Button asChild size='lg'>
          <Link href='/shop'>Continue Shopping</Link>
        </Button>
        <Button asChild size='lg' variant='outline'>
          <Link href='/dashboard/orders'>Manage Orders</Link>
        </Button>
      </div>
    </div>
  );
}
