import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className='container-page flex min-h-[60vh] flex-col justify-center py-14'>
      <p
        aria-hidden='true'
        className='font-heading text-[clamp(8rem,30vw,22rem)] leading-[0.8] font-bold select-none'
      >
        404
        <span className='ml-[0.04em] inline-block size-[0.1em] bg-brand' />
      </p>
      <h1 className='mt-8 text-4xl sm:text-5xl'>Page not found</h1>
      <p className='mt-4 max-w-md text-lg text-pretty text-muted-foreground'>
        The page you are looking for was not found. It may have moved, or the
        link might be mistyped.
      </p>
      <div className='mt-8 flex flex-wrap gap-3'>
        <Button asChild size='lg'>
          <Link href='/'>Back to home</Link>
        </Button>
        <Button asChild size='lg' variant='outline'>
          <Link href='/shop'>Browse the shop</Link>
        </Button>
      </div>
    </div>
  );
}
