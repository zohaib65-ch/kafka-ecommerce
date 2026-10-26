import Image from 'next/image';
import { PackageCheck, Truck, Heart } from 'lucide-react';

import { siteImages } from '@/lib/site-images';
import { cn } from '@/lib/utils';

type AuthShellProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Secondary actions under the form, e.g. "New here? Create an account". */
  footer?: React.ReactNode;
  /** 'split' shows the photo panel beside the form on md+; 'single' is one centered card. */
  variant?: 'split' | 'single';
  className?: string;
};

const perks = [
  { icon: Truck, text: 'Free shipping on every order' },
  { icon: PackageCheck, text: 'Follow every order from your dashboard' },
  { icon: Heart, text: 'Save favorites to your wishlist' }
];

/** Shared frame for login, register, forgot/reset password and merchant sign up. */
export function AuthShell({
  title,
  description,
  children,
  footer,
  variant = 'split',
  className
}: AuthShellProps) {
  const split = variant === 'split';

  return (
    <div className='bg-hero-glow'>
      <div className='container-page py-10 lg:py-14'>
        <div
          className={cn(
            'mx-auto grid overflow-hidden rounded-3xl border bg-card shadow-soft',
            split ? 'max-w-5xl md:grid-cols-[1.05fr_0.95fr]' : 'max-w-2xl',
            className
          )}
        >
          <div className='p-6 sm:p-10'>
            <header className='mb-8 space-y-2'>
              <h1 className='text-3xl font-semibold tracking-tight sm:text-4xl'>
                {title}
              </h1>
              {description && (
                <p className='text-pretty text-muted-foreground'>
                  {description}
                </p>
              )}
            </header>
            {children}
            {footer && (
              <div className='mt-8 border-t pt-6 text-sm text-muted-foreground'>
                {footer}
              </div>
            )}
          </div>

          {split && (
            <aside className='relative hidden min-h-[34rem] md:block'>
              <Image
                src={siteImages.auth.src}
                alt={siteImages.auth.alt}
                fill
                priority
                sizes='(min-width: 1024px) 480px, 40vw'
                className='object-cover'
              />
              <div
                aria-hidden='true'
                className='absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent'
              />
              <div className='absolute inset-x-0 bottom-0 space-y-4 p-8 text-ink-foreground'>
                <p className='font-heading text-2xl leading-tight font-semibold text-balance'>
                  Everything you love, delivered to your door.
                </p>
                <ul className='space-y-2 text-sm'>
                  {perks.map(({ icon: Icon, text }) => (
                    <li key={text} className='flex items-center gap-2.5'>
                      <Icon className='size-4 shrink-0' aria-hidden='true' />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
