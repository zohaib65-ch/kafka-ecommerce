import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteImages } from '@/lib/site-images';
import { cn } from '@/lib/utils';

const promos = [
  {
    image: siteImages.promo1,
    title: 'Things for the living room',
    text: 'Lamps, throws, vases and shelves for the room you sit in most.',
    cta: 'Shop all',
    panel: 'bg-secondary text-secondary-foreground',
    photoSide: 'md:order-1'
  },
  {
    image: siteImages.promo2,
    title: 'Free shipping on everything',
    text: 'There is no minimum order. You pay for the products and nothing else.',
    cta: 'Start shopping',
    panel: 'bg-brand text-brand-foreground',
    photoSide: 'md:order-2'
  }
];

/** Two flat photo | text rows, one with the photo on each side. */
export function PromoBanners() {
  return (
    <section
      aria-label='Promotions'
      className='container-page mt-20 space-y-4 lg:mt-28'
    >
      {promos.map((promo, index) => (
        <div
          key={promo.title}
          className='grid border border-foreground md:grid-cols-2'
        >
          <div
            className={cn(
              'relative aspect-[4/3] md:aspect-auto md:min-h-80',
              index === 0 ? 'md:order-1' : 'md:order-2'
            )}
          >
            <Image
              src={promo.image.src}
              alt={promo.image.alt}
              fill
              sizes='(min-width: 1280px) 664px, (min-width: 768px) 50vw, 100vw'
              className='object-cover'
            />
          </div>
          <div
            className={cn(
              'flex flex-col justify-between gap-8 p-6 sm:p-10',
              promo.panel,
              index === 0 ? 'md:order-2' : 'md:order-1'
            )}
          >
            <h2 className='text-5xl sm:text-6xl'>{promo.title}</h2>
            <div className='space-y-5'>
              <p className='max-w-sm text-lg'>{promo.text}</p>
              <Button
                asChild
                size='lg'
                className='hover:bg-background hover:text-foreground'
              >
                <Link href='/shop'>
                  {promo.cta} <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
