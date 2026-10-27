import Image from 'next/image';

import { siteImages } from '@/lib/site-images';

type AuthShellProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Secondary links under the form, e.g. "New here? Create an account". */
  footer?: React.ReactNode;
};

/** Shared frame for login, register, forgot/reset password and merchant sign up. */
export function AuthShell({
  title,
  description,
  children,
  footer
}: AuthShellProps) {
  return (
    <div className='container-page py-10 lg:py-16'>
      <div className='grid gap-10 md:grid-cols-[5fr_6fr] lg:gap-20'>
        <figure className='hidden flex-col md:flex'>
          <div className='relative min-h-[34rem] flex-1'>
            <Image
              src={siteImages.auth.src}
              alt={siteImages.auth.alt}
              fill
              priority
              sizes='(min-width: 768px) 45vw, 0px'
              className='object-cover'
            />
          </div>
          <figcaption className='meta mt-3'>
            Vases and berry branches
          </figcaption>
        </figure>

        <div className='min-w-0'>
          <div className='section-rule max-w-lg pt-5'>
            <h1 className='text-5xl sm:text-6xl'>{title}</h1>
            {description && (
              <p className='mt-4 text-lg text-pretty text-muted-foreground'>
                {description}
              </p>
            )}
            <div className='mt-8'>{children}</div>
            {footer && (
              <div className='mt-8 border-t pt-5 text-[0.95rem] text-muted-foreground'>
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
