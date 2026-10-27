import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { SITE_NAME } from '@/lib/constants';
import { siteImages } from '@/lib/site-images';

const benefits = [
  {
    title: 'Your own brand',
    text: 'Your products are listed under your brand, and shoppers can browse the whole store by brand.'
  },
  {
    title: 'A merchant dashboard',
    text: 'Manage your brand, your products and your orders in one place.'
  },
  {
    title: 'Support chat',
    text: `Talk to the ${SITE_NAME} team from your dashboard when you need help.`
  }
];

const steps = [
  {
    title: 'Apply',
    text: 'Fill in the form below with your details and your brand.'
  },
  {
    title: 'We review',
    text: 'Our team reads every application. You get an email confirming we received yours.'
  },
  {
    title: 'Create your account',
    text: 'If your application is approved, we email you a link to finish your merchant sign up.'
  },
  {
    title: 'Start selling',
    text: 'Add your products and follow orders from your dashboard.'
  }
];

export function SellHero() {
  return (
    <section className='container-page py-10 lg:py-14'>
      <div className='section-rule grid gap-10 pt-6 lg:grid-cols-12 lg:gap-12'>
        <div className='flex flex-col justify-between gap-10 lg:col-span-7'>
          <h1 className='text-[clamp(3.5rem,11vw,9rem)]'>
            Sell on {SITE_NAME}
          </h1>
          <div className='max-w-xl space-y-6'>
            <p className='text-xl text-pretty text-muted-foreground'>
              Apply to list your products under your own brand. We review every
              application and email you the next step.
            </p>
            <Button asChild size='lg'>
              <a href='#apply'>Apply today</a>
            </Button>
          </div>
        </div>
        <figure className='lg:col-span-5'>
          <div className='relative aspect-[4/3] w-full'>
            <Image
              src={siteImages.sell.src}
              alt={siteImages.sell.alt}
              fill
              priority
              sizes='(min-width: 1024px) 500px, 100vw'
              className='object-cover'
            />
          </div>
          <figcaption className='meta mt-3'>Packing an order</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function SellBenefits() {
  return (
    <section
      aria-labelledby='sell-benefits'
      className='container-page py-10 lg:py-14'
    >
      <div className='section-rule grid gap-6 pt-6 lg:grid-cols-[1fr_2fr] lg:gap-12'>
        <h2 id='sell-benefits' className='text-4xl sm:text-5xl'>
          What you get
        </h2>
        <dl className='divide-y border-b'>
          {benefits.map(({ title, text }) => (
            <div
              key={title}
              className='grid gap-1 py-5 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-8'
            >
              <dt className='font-heading text-2xl leading-tight font-semibold'>
                {title}
              </dt>
              <dd className='text-muted-foreground'>{text}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function SellSteps() {
  return (
    <section
      aria-labelledby='sell-steps'
      className='container-page py-10 lg:py-14'
    >
      <div className='section-rule grid gap-6 pt-6 lg:grid-cols-[1fr_2fr] lg:gap-12'>
        <h2 id='sell-steps' className='text-4xl sm:text-5xl'>
          How it works
        </h2>
        <ol className='divide-y border-b'>
          {steps.map(({ title, text }, index) => (
            <li
              key={title}
              className='grid grid-cols-[3.5rem_1fr] gap-x-4 gap-y-1 py-5 first:pt-0 sm:grid-cols-[4.5rem_12rem_1fr] sm:gap-x-6'
            >
              <span
                aria-hidden='true'
                className='tabular row-span-2 font-heading text-4xl leading-none font-semibold sm:row-span-1'
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className='font-heading text-2xl leading-tight font-semibold'>
                {title}
              </h3>
              <p className='text-muted-foreground'>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Wrapper for the application form (anchor target of the hero button). */
export function SellApply({ children }: { children: React.ReactNode }) {
  return (
    <section
      id='apply'
      aria-labelledby='sell-apply'
      className='container-page scroll-mt-24 py-10 lg:py-14'
    >
      <div className='section-rule grid gap-6 pt-6 lg:grid-cols-[1fr_2fr] lg:gap-12'>
        <div className='max-w-sm space-y-4'>
          <h2 id='sell-apply' className='text-4xl sm:text-5xl'>
            Apply to sell
          </h2>
          <p className='text-muted-foreground'>
            Tell us about you and your business. We reply by email.
          </p>
        </div>
        <div className='border bg-card p-6 sm:p-8'>{children}</div>
      </div>
    </section>
  );
}
