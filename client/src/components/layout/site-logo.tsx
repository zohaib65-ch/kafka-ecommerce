import Link from 'next/link';

import { SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

/** Wordmark: condensed capitals with an orange full stop. */
export function SiteLogo({ className }: { className?: string }) {
  return (
    <Link
      href='/'
      aria-label={`${SITE_NAME} home`}
      className={cn(
        'inline-flex items-baseline font-heading text-[1.7rem] leading-none font-bold tracking-[0.01em] uppercase',
        className
      )}
    >
      {SITE_NAME}
      <span
        aria-hidden='true'
        className='ml-0.5 inline-block size-[0.42rem] bg-brand'
      />
    </Link>
  );
}
