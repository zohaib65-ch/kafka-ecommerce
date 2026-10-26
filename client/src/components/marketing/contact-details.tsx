import Image from 'next/image';
import Link from 'next/link';
import { Phone, Truck } from 'lucide-react';

import { SUPPORT_PHONE } from '@/lib/constants';
import { siteImages } from '@/lib/site-images';

/** Photo + the ways to reach the team, shown beside the contact form. */
export function ContactDetails() {
  return (
    <div className='space-y-4'>
      <div className='relative aspect-[3/2] overflow-hidden rounded-3xl border'>
        <Image
          src={siteImages.contact.src}
          alt={siteImages.contact.alt}
          fill
          priority
          sizes='(min-width: 1024px) 420px, 100vw'
          className='object-cover'
        />
      </div>
      <ul className='divide-y rounded-2xl border bg-card'>
        <li className='flex items-start gap-4 p-5'>
          <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
            <Phone className='size-5' aria-hidden='true' />
          </span>
          <div>
            <h2 className='text-base font-semibold'>Call us</h2>
            <a
              href={`tel:${SUPPORT_PHONE.replace(/-/g, '')}`}
              className='text-sm font-medium text-primary hover:underline'
            >
              {SUPPORT_PHONE}
            </a>
          </div>
        </li>
        <li className='flex items-start gap-4 p-5'>
          <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
            <Truck className='size-5' aria-hidden='true' />
          </span>
          <div>
            <h2 className='text-base font-semibold'>
              Questions about delivery?
            </h2>
            <Link
              href='/shipping'
              className='text-sm font-medium text-primary hover:underline'
            >
              Read our shipping information
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
