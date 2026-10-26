import type { Metadata } from 'next';
import Link from 'next/link';
import { Headset, PackageCheck, Truck } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Shipping',
  description: 'Shipping information for orders placed on Marketlane.'
};

const highlights = [
  {
    icon: Truck,
    title: 'Free shipping',
    text: 'Every order ships free. The bag total you see is the total you pay.'
  },
  {
    icon: PackageCheck,
    title: 'Follow your order',
    text: 'Sign in and open Orders in your dashboard to see the status of each item as it is processed, shipped and delivered.'
  },
  {
    icon: Headset,
    title: 'Need a hand?',
    text: 'Questions about a delivery? Our team is happy to help with anything about your order.'
  }
];

export default function ShippingPage() {
  return (
    <div className='container-page max-w-4xl py-12 lg:py-16'>
      <PageHeader
        eyebrow='Customer service'
        title='Shipping'
        description='Simple, transparent delivery on everything in the store.'
      />

      <ul className='mt-10 grid gap-4 sm:grid-cols-3'>
        {highlights.map(({ icon: Icon, title, text }) => (
          <li key={title} className='rounded-2xl border bg-card p-6'>
            <span className='grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground'>
              <Icon className='size-5' aria-hidden='true' />
            </span>
            <h2 className='mt-4 text-lg font-semibold'>{title}</h2>
            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
              {text}
            </p>
          </li>
        ))}
      </ul>

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
