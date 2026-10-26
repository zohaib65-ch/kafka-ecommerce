import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteImages } from '@/lib/site-images';

const promos = [
  {
    image: siteImages.promo1,
    eyebrow: 'Home favorites',
    title: 'Cozy corners, thoughtfully picked',
    cta: 'Shop home'
  },
  {
    image: siteImages.promo2,
    eyebrow: 'Free shipping',
    title: 'Fresh finds at your door',
    cta: 'Start shopping'
  }
];

export function PromoBanners() {
  return (
    <section aria-label='Promotions' className='container-page mt-16 lg:mt-24'>
      <ul className='grid gap-4 md:grid-cols-2 lg:gap-6'>
        {promos.map(promo => (
          <li key={promo.title}>
            <div className='group relative isolate flex aspect-[16/11] flex-col justify-end overflow-hidden rounded-3xl border sm:aspect-[16/9]'>
              <Image
                src={promo.image.src}
                alt={promo.image.alt}
                fill
                sizes='(min-width: 1280px) 596px, (min-width: 768px) 50vw, 100vw'
                className='object-cover transition-transform duration-700 group-hover:scale-105'
              />
              <div
                aria-hidden='true'
                className='absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent'
              />
              <div className='relative z-10 space-y-3 p-6 text-ink-foreground sm:p-8'>
                <p className='text-xs font-semibold tracking-widest uppercase opacity-90'>
                  {promo.eyebrow}
                </p>
                <h2 className='font-heading text-2xl leading-tight font-semibold sm:text-3xl'>
                  {promo.title}
                </h2>
                <Button
                  asChild
                  className='bg-ink-foreground text-ink hover:bg-ink-foreground/90'
                >
                  <Link href='/shop'>
                    {promo.cta} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
