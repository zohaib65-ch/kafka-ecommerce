import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteImages } from '@/lib/site-images';

export function SellCta() {
  return (
    <section
      aria-labelledby='home-sell'
      className='container-page mt-16 lg:mt-24'
    >
      <div className='grid overflow-hidden rounded-3xl bg-ink text-ink-foreground md:grid-cols-2'>
        <div className='flex flex-col justify-center gap-5 p-8 sm:p-12'>
          <p className='text-xs font-semibold tracking-widest text-primary-foreground/80 uppercase'>
            Sell with us
          </p>
          <h2
            id='home-sell'
            className='font-heading text-3xl leading-tight font-semibold sm:text-4xl'
          >
            Would you like to sell your products on Marketlane?
          </h2>
          <p className='max-w-md text-base opacity-80'>
            Grow your business with Marketlane. Apply today and reach new
            customers.
          </p>
          <div>
            <Button asChild size='lg'>
              <Link href='/sell'>
                Apply today <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
        <div className='relative min-h-64 md:min-h-96'>
          <Image
            src={siteImages.sell.src}
            alt={siteImages.sell.alt}
            fill
            sizes='(min-width: 1280px) 608px, (min-width: 768px) 50vw, 100vw'
            className='object-cover'
          />
        </div>
      </div>
    </section>
  );
}
