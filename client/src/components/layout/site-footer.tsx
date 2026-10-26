import Link from 'next/link';

import {
  FacebookIcon,
  InstagramIcon,
  PinterestIcon,
  TwitterIcon
} from '@/components/shared/brand-icons';
import { SITE_NAME, SUPPORT_PHONE } from '@/lib/constants';

const customerService = [
  { name: 'Contact Us', href: '/contact' },
  { name: 'Sell With Us', href: '/sell' },
  { name: 'Shipping', href: '/shipping' }
];

const account = [
  { name: 'Account Details', href: '/dashboard' },
  { name: 'Orders', href: '/dashboard/orders' },
  { name: 'Wishlist', href: '/dashboard/wishlist' },
  { name: 'Support', href: '/support' }
];

const socials = [
  { name: 'Facebook', href: 'https://www.facebook.com/', Icon: FacebookIcon },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/',
    Icon: InstagramIcon
  },
  {
    name: 'Pinterest',
    href: 'https://www.pinterest.com/',
    Icon: PinterestIcon
  },
  { name: 'Twitter', href: 'https://twitter.com/', Icon: TwitterIcon }
];

function LinkColumn({
  title,
  links
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <h2 className='font-sans text-xs font-semibold tracking-[0.14em] text-ink-foreground/60 uppercase'>
        {title}
      </h2>
      <ul className='mt-4 space-y-2'>
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className='decoration-brand decoration-2 underline-offset-4 hover:underline'
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className='mt-28 bg-ink text-ink-foreground'>
      <div className='container-page pt-14 pb-8'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]'>
          <div className='max-w-sm'>
            <p className='font-heading text-3xl leading-[0.95] font-semibold uppercase'>
              Free shipping on every order.
            </p>
            <p className='mt-4 text-ink-foreground/70'>
              Questions? Call{' '}
              <a
                href={`tel:${SUPPORT_PHONE.replace(/-/g, '')}`}
                className='text-ink-foreground underline decoration-brand decoration-2 underline-offset-4'
              >
                {SUPPORT_PHONE}
              </a>{' '}
              or{' '}
              <Link
                href='/contact'
                className='text-ink-foreground underline decoration-brand decoration-2 underline-offset-4'
              >
                send us a message
              </Link>
              .
            </p>
          </div>
          <LinkColumn title='Customer Service' links={customerService} />
          <LinkColumn title='My Account' links={account} />
        </div>

        <p
          aria-hidden='true'
          className='mt-14 font-heading text-[clamp(3.5rem,17vw,14rem)] leading-[0.8] font-bold tracking-[-0.01em] uppercase select-none'
        >
          {SITE_NAME}
          <span className='ml-[0.04em] inline-block size-[0.1em] bg-brand' />
        </p>

        <div className='mt-8 flex flex-col items-start justify-between gap-4 border-t border-ink-foreground/20 pt-5 sm:flex-row sm:items-center'>
          <p className='text-sm text-ink-foreground/60'>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <ul className='flex items-center gap-1'>
            {socials.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target='_blank'
                  rel='noreferrer noopener'
                  aria-label={name}
                  className='grid size-10 place-items-center transition-colors hover:bg-brand hover:text-brand-foreground'
                >
                  <Icon className='size-4' />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
