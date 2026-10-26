import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className='container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center'>
      <span className='grid size-20 place-items-center rounded-full bg-accent text-accent-foreground'>
        <Compass className='size-9' aria-hidden='true' />
      </span>
      <p className='mt-8 text-sm font-semibold tracking-widest text-primary uppercase'>
        Error 404
      </p>
      <h1 className='mt-2 text-4xl font-semibold sm:text-5xl'>
        Page not found
      </h1>
      <p className='mt-4 max-w-md text-pretty text-muted-foreground'>
        The page you are looking for was not found. It may have moved, or the
        link might be mistyped.
      </p>
      <div className='mt-8 flex flex-wrap justify-center gap-3'>
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
