import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed } from 'next/font/google';

import { Providers } from '@/components/providers';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';

import './globals.css';

const body = Barlow({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap'
});

const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:8080'
  ),
  title: {
    default: `${SITE_NAME} — Quality products, free shipping`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  icons: {
    // /icon.svg is picked up from src/app/icon.svg; the .ico is the fallback for older browsers.
    icon: '/images/favicon.ico',
    apple: '/images/apple-touch-icon.png'
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f0e7' },
    { media: '(prefers-color-scheme: dark)', color: '#161412' }
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(body.variable, display.variable)}
    >
      <body className='flex min-h-screen flex-col'>
        <Providers>
          <a
            href='#main-content'
            className='sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3'
          >
            Skip to main content
          </a>
          <SiteHeader />
          <main id='main-content' className='flex-1'>
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
