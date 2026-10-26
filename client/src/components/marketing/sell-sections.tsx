import Image from 'next/image';
import {
  ClipboardList,
  Headset,
  LayoutDashboard,
  MailCheck,
  PackagePlus,
  Search,
  Tag,
  UserCheck
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { siteImages } from '@/lib/site-images';

const benefits = [
  {
    icon: Tag,
    title: 'Your own brand',
    text: 'Your products are listed under your brand, and shoppers can browse the whole store by brand.'
  },
  {
    icon: LayoutDashboard,
    title: 'One merchant dashboard',
    text: 'Manage your brand, products and orders from a single dashboard.'
  },
  {
    icon: Headset,
    title: 'Support along the way',
    text: 'Chat with the Marketlane team from your dashboard whenever you need a hand.'
  }
];

const steps = [
  {
    icon: ClipboardList,
    title: 'Apply',
    text: 'Tell us about you and your brand with the application form below.'
  },
  {
    icon: Search,
    title: 'We review',
    text: 'Our team reviews every application. You will receive an email confirming we got yours.'
  },
  {
    icon: UserCheck,
    title: 'Create your account',
    text: 'Once approved, we email you a link to complete your merchant sign up.'
  },
  {
    icon: PackagePlus,
    title: 'Start selling',
    text: 'Add your products and keep track of orders from your dashboard.'
  }
];

export function SellHero() {
  return (
    <section className='bg-hero-glow border-b'>
      <div className='container-page grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20'>
        <div className='space-y-6'>
          <p className='text-xs font-semibold tracking-widest text-primary uppercase'>
            Sell with us
          </p>
          <h1 className='text-4xl font-semibold tracking-tight sm:text-5xl'>
            Become A Marketlane Seller!
          </h1>
          <p className='max-w-xl text-lg text-pretty text-muted-foreground'>
            Would you like to sell your products on Marketlane? Grow your
            business with Marketlane.
          </p>
          <Button asChild size='lg'>
            <a href='#apply'>Apply Today</a>
          </Button>
        </div>
        <div className='relative'>
          <div className='relative aspect-[4/3] overflow-hidden rounded-3xl border shadow-lift'>
            <Image
              src={siteImages.sell.src}
              alt={siteImages.sell.alt}
              fill
              priority
              sizes='(min-width: 1024px) 560px, 100vw'
              className='object-cover'
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export function SellBenefits() {
  return (
    <section
      aria-labelledby='sell-benefits'
      className='container-page py-14 lg:py-20'
    >
      <div className='max-w-2xl space-y-3'>
        <h2
          id='sell-benefits'
          className='text-3xl font-semibold tracking-tight'
        >
          Why sell on Marketlane
        </h2>
        <p className='text-pretty text-muted-foreground'>
          Everything you need to put your brand in front of shoppers.
        </p>
      </div>
      <ul className='mt-10 grid gap-4 sm:grid-cols-3'>
        {benefits.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            className='rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lift'
          >
            <span className='grid size-11 place-items-center rounded-xl bg-accent text-accent-foreground'>
              <Icon className='size-5' aria-hidden='true' />
            </span>
            <h3 className='mt-4 text-lg font-semibold'>{title}</h3>
            <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
              {text}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SellSteps() {
  return (
    <section aria-labelledby='sell-steps' className='border-y bg-muted/50'>
      <div className='container-page py-14 lg:py-20'>
        <div className='max-w-2xl space-y-3'>
          <h2 id='sell-steps' className='text-3xl font-semibold tracking-tight'>
            How it works
          </h2>
          <p className='text-pretty text-muted-foreground'>
            From application to your first order in four steps.
          </p>
        </div>
        <ol className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className='relative rounded-2xl border bg-card p-6'>
              <span className='absolute top-5 right-6 font-heading text-4xl font-semibold text-muted-foreground/60'>
                {index + 1}
              </span>
              <span className='grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground'>
                <Icon className='size-5' aria-hidden='true' />
              </span>
              <h3 className='mt-4 text-lg font-semibold'>{title}</h3>
              <p className='mt-2 text-sm leading-relaxed text-muted-foreground'>
                {text}
              </p>
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
      className='container-page scroll-mt-24 py-14 lg:py-20'
    >
      <div className='mx-auto max-w-3xl rounded-3xl border bg-card p-6 shadow-soft sm:p-10'>
        <div className='mb-8 flex items-start gap-4'>
          <span className='grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground'>
            <MailCheck className='size-6' aria-hidden='true' />
          </span>
          <div className='space-y-1'>
            <h2
              id='sell-apply'
              className='text-2xl font-semibold tracking-tight'
            >
              Apply today
            </h2>
            <p className='text-sm text-pretty text-muted-foreground'>
              Share a few details about your business and we will be in touch by
              email.
            </p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
