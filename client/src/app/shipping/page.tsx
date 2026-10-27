import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { SUPPORT_PHONE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'Shipping information for orders placed on Marketlane.'
};

const sections = [
  {
    title: 'Free shipping on every order',
    text: 'The total in your bag is the total you pay. There is no shipping fee.'
  },
  {
    title: 'Follow your order',
    text: 'Sign in and open Orders in your dashboard. Each item shows where it is: processing, shipped or delivered.'
  },
  {
    title: 'Questions about a delivery',
    text: `Send us a message or call ${SUPPORT_PHONE} and we will look into it.`
  }
];

export default function ShippingPage() {
  return (
    <div className='container-page py-10 lg:py-14'>
      <PageHeader
        title='Shipping'
        description='Delivery on Marketlane is free.'
      />

      <dl className='mt-12 max-w-4xl divide-y border-y'>
        {sections.map(({ title, text }) => (
          <div
            key={title}
            className='grid gap-2 py-6 sm:grid-cols-[22rem_1fr] sm:gap-10'
          >
            <dt className='font-heading text-3xl leading-tight font-semibold'>
              {title}
            </dt>
            <dd className='text-lg text-muted-foreground'>{text}</dd>
          </div>
        ))}
      </dl>

      <div className='mt-10 flex flex-wrap gap-3'>
        <Button asChild>
          <Link href='/dashboard/orders'>View my orders</Link>
        </Button>
        <Button asChild variant='outline'>
          <Link href='/contact'>Contact us</Link>
        </Button>
      </div>
    </div>
  );
}
