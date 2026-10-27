import Image from 'next/image';
import Link from 'next/link';

import { SUPPORT_PHONE } from '@/lib/constants';
import { siteImages } from '@/lib/site-images';

/** Photo and the ways to reach the team, shown beside the contact form. */
export function ContactDetails() {
  return (
    <div className='space-y-8 lg:pr-14'>
      <figure>
        <div className='relative aspect-[3/2] w-full'>
          <Image
            src={siteImages.contact.src}
            alt={siteImages.contact.alt}
            fill
            priority
            sizes='(min-width: 1024px) 460px, 100vw'
            className='object-cover'
          />
        </div>
        <figcaption className='meta mt-3'>The support desk</figcaption>
      </figure>

      <dl className='divide-y border-y'>
        <div className='py-5'>
          <dt className='meta'>Phone</dt>
          <dd className='mt-1'>
            <a
              href={`tel:${SUPPORT_PHONE.replace(/-/g, '')}`}
              className='font-heading text-4xl leading-none font-semibold underline decoration-brand decoration-2 underline-offset-4 hover:bg-brand hover:text-brand-foreground'
            >
              {SUPPORT_PHONE}
            </a>
          </dd>
        </div>
        <div className='py-5'>
          <dt className='meta'>Delivery</dt>
          <dd className='mt-1'>
            Questions about delivery? Read the{' '}
            <Link
              href='/shipping'
              className='font-semibold underline decoration-brand decoration-2 underline-offset-4 hover:bg-brand hover:text-brand-foreground'
            >
              shipping information
            </Link>
            .
          </dd>
        </div>
      </dl>
    </div>
  );
}
