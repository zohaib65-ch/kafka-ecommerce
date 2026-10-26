'use client';

import { useCallback, useEffect, useState } from 'react';
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

// Copy per slide id (see heroSlides in lib/site-images.ts). `position` keeps the subject of the
// photo visible when the image is cropped to the banner shape.
const slideContent: Record<
  string,
  { eyebrow: string; title: string; text: string; position: string }
> = {
  fashion: {
    eyebrow: 'New arrivals',
    title: 'Find what you love, delivered free',
    text: 'Discover fresh picks from trusted brands and independent merchants, with free shipping on every order.',
    position: 'object-[75%_30%] md:object-[70%_25%]'
  },
  tech: {
    eyebrow: 'Everyday essentials',
    title: 'Upgrade the way you work and play',
    text: 'Gadgets, accessories and desk setups worth having, all in one place.',
    position: 'object-center'
  },
  home: {
    eyebrow: 'Home & living',
    title: 'Make your space feel like home',
    text: 'Furniture, decor and little luxuries to turn any room into your favorite one.',
    position: 'object-center'
  }
};

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

  const scrollTo = useCallback((index: number) => api?.scrollTo(index), [api]);

  return (
    <section className='container-page pt-6 lg:pt-8'>
      <Carousel
        opts={{ loop: true }}
        setApi={setApi}
        className='relative'
        aria-label='Featured collections'
      >
        <CarouselContent className='-ml-0'>
          {heroSlides.map((slide, index) => {
            const content = slideContent[slide.id];
            const Heading = index === 0 ? 'h1' : 'h2';

            return (
              <CarouselItem key={slide.id} className='pl-0'>
                <div className='relative isolate h-[30rem] overflow-hidden rounded-3xl sm:h-[34rem] lg:h-[36rem]'>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes='(min-width: 1280px) 1216px, 100vw'
                    className={cn('object-cover', content?.position)}
                  />
                  <div
                    aria-hidden='true'
                    className='absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10 md:bg-gradient-to-r md:from-ink/85 md:via-ink/55 md:to-transparent'
                  />
                  <div className='relative z-10 flex h-full max-w-2xl flex-col justify-end gap-4 p-6 pb-20 text-ink-foreground sm:p-12 sm:pb-20 md:justify-center md:pb-12'>
                    <p className='text-xs font-semibold tracking-widest uppercase opacity-90'>
                      {content?.eyebrow}
                    </p>
                    <Heading className='font-heading text-4xl leading-[1.05] font-semibold sm:text-5xl lg:text-6xl'>
                      {content?.title}
                    </Heading>
                    <p className='max-w-lg text-base opacity-90 sm:text-lg'>
                      {content?.text}
                    </p>
                    <div className='mt-2 flex flex-wrap gap-3'>
                      <Button
                        asChild
                        size='lg'
                        className='bg-ink-foreground text-ink hover:bg-ink-foreground/90'
                      >
                        <Link href='/shop'>
                          Shop now <ArrowRight />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size='lg'
                        variant='outline'
                        className='border-ink-foreground/50 bg-transparent text-ink-foreground hover:bg-ink-foreground/15 hover:text-ink-foreground dark:bg-transparent'
                      >
                        <Link href='/brands'>Browse brands</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className='absolute right-5 bottom-5 left-6 z-20 flex items-center justify-between sm:right-8 sm:bottom-8 sm:left-12'>
          <div
            className='flex items-center gap-2'
            role='group'
            aria-label='Choose a slide'
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type='button'
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={current === index}
                className={cn(
                  'h-2 rounded-full bg-ink-foreground/50 transition-all hover:bg-ink-foreground/80',
                  current === index ? 'w-8 bg-ink-foreground' : 'w-2'
                )}
              />
            ))}
          </div>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              size='icon'
              variant='outline'
              className='rounded-full border-ink-foreground/40 bg-ink/30 text-ink-foreground backdrop-blur-sm hover:bg-ink/50 hover:text-ink-foreground dark:bg-ink/30'
              aria-label='Previous slide'
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft />
            </Button>
            <Button
              type='button'
              size='icon'
              variant='outline'
              className='rounded-full border-ink-foreground/40 bg-ink/30 text-ink-foreground backdrop-blur-sm hover:bg-ink/50 hover:text-ink-foreground dark:bg-ink/30'
              aria-label='Next slide'
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </Carousel>
    </section>
  );
}
