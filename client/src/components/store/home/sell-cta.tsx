import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteImages } from '@/lib/site-images';

const steps = [
  'Send your application.',
  'We review it and email you a link.',
  'Set up your account and add your products.'
];

/** Invitation to sell: flat photo beside an ink panel with the three steps and one button. */
export function SellCta() {
  const { sell } = siteImages;

  return (
    <section
      aria-labelledby='home-sell'
      className='container-page mt-20 lg:mt-28'
    >
      <div className='grid border md:grid-cols-2'>
        <div className='relative min-h-64 md:min-h-[26rem]'>
          <Image
            src={sell.src}
            alt={sell.alt}
            fill
            sizes='(min-width: 1344px) 672px, (min-width: 768px) 50vw, 100vw'
            className='object-cover'
          />
        </div>
        <div className='bg-ink p-8 text-ink-foreground lg:p-12'>
          <h2 id='home-sell' className='text-5xl sm:text-6xl'>
            Sell on Marketlane.
          </h2>
          <ol className='mt-8 border-t border-ink-foreground/25'>
            {steps.map((step, index) => (
              <li
                key={step}
                className='flex gap-4 border-b border-ink-foreground/25 py-3'
              >
                <span className='tabular w-6 shrink-0 font-heading text-xl font-semibold text-brand'>
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <Button
            asChild
            size='lg'
            className='mt-8 bg-brand text-brand-foreground hover:bg-ink-foreground hover:text-ink'
          >
            <Link href='/sell'>
              Apply to sell <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
