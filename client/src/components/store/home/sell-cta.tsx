import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function SellCta() {
  return (
    // The negative bottom margin cancels the footer's top margin so the band sits flush on it.
    <section
      aria-labelledby='home-sell'
      className='-mb-28 mt-20 bg-brand text-brand-foreground lg:mt-28'
    >
      <div className='container-page grid gap-8 py-14 md:grid-cols-[1fr_auto] md:items-end lg:py-20'>
        <div>
          <h2
            id='home-sell'
            className='max-w-3xl text-6xl sm:text-7xl lg:text-8xl'
          >
            Sell your products on Marketlane.
          </h2>
          <p className='mt-5 max-w-md text-lg'>
            Apply to open a shop. We review applications and email you a link to
            set up your account.
          </p>
        </div>
        <Button
          asChild
          size='lg'
          className='hover:bg-background hover:text-foreground'
        >
          <Link href='/sell'>
            Apply to sell <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
