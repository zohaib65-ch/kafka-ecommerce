'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { heroSlides } from '@/lib/site-images';
import { cn } from '@/lib/utils';

type CarouselApi = Parameters<
  NonNullable<React.ComponentProps<typeof Carousel>['setApi']>
>[0];

// Caption and crop per slide id (see heroSlides in lib/site-images.ts). `position` keeps the
// subject of the photo visible when the image is cropped to the frame.
const slideContent: Record<string, { caption: string; position: string }> = {
  fashion: {
    caption: 'Clothes and carry-alls',
    position: 'object-[75%_30%]'
  },
  tech: { caption: 'Desk and tech', position: 'object-center' },
  home: { caption: 'Home and living', position: 'object-center' }
};

const pad = (value: number) => String(value).padStart(2, '0');

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const slide = heroSlides[current] ?? heroSlides[0];

  return (
    <section className='container-page pt-8 lg:pt-12'>
      <div className='grid gap-8 lg:grid-cols-12 lg:gap-12'>
        <div className='flex flex-col justify-between gap-10 lg:col-span-5'>
          <div>
            <h1 className='text-[3.4rem] sm:text-7xl lg:text-[5.6rem]'>
              Everyday things for the house, the desk and the table.
            </h1>
            <p className='mt-6 max-w-md text-lg text-muted-foreground'>
              Products from brands and independent merchants. Shipping is free
              on every order.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Button asChild size='lg'>
              <Link href='/shop'>
                Shop all <ArrowRight />
              </Link>
            </Button>
            <Button asChild size='lg' variant='outline'>
              <Link href='/brands'>Browse brands</Link>
            </Button>
          </div>
        </div>

        <div className='lg:col-span-7'>
          <Carousel
            opts={{ loop: true }}
            setApi={setApi}
            aria-label='Featured photos'
          >
            <CarouselContent className='-ml-0'>
              {heroSlides.map((item, index) => (
                <CarouselItem key={item.id} className='pl-0'>
                  <div className='relative aspect-[4/3] overflow-hidden border border-foreground bg-muted'>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      priority={index === 0}
                      sizes='(min-width: 1280px) 700px, (min-width: 1024px) 58vw, 100vw'
                      className={cn(
                        'object-cover',
                        slideContent[item.id]?.position
                      )}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className='mt-3 flex items-center justify-between gap-4'>
            <p className='meta tabular' aria-live='polite'>
              {pad(current + 1)} / {pad(heroSlides.length)}
              <span className='mx-2 text-border'>—</span>
              {slideContent[slide.id]?.caption}
            </p>
            <div className='flex'>
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='-mr-px'
                aria-label='Previous photo'
                onClick={() => api?.scrollPrev()}
              >
                <ChevronLeft />
              </Button>
              <Button
                type='button'
                size='icon'
                variant='outline'
                aria-label='Next photo'
                onClick={() => api?.scrollNext()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
