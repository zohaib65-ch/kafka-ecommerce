'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signOut } from '@/store/login/actions';
import { toggleMenu } from '@/store/navigation/actions';

import { SiteLogo } from './site-logo';

const bigLink = (active: boolean) =>
  cn(
    'block border-b py-2.5 font-heading text-[1.7rem] leading-none font-semibold uppercase decoration-2 underline-offset-8 hover:underline hover:decoration-brand',
    active && 'underline decoration-brand'
  );

const smallLink = (active: boolean) =>
  cn(
    'block py-1.5 text-[0.95rem] decoration-2 underline-offset-4 hover:underline hover:decoration-brand',
    active && 'font-semibold underline decoration-brand'
  );

function Group({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className='meta mb-2 font-sans text-xs tracking-[0.12em]'>{title}</h2>
      {children}
    </div>
  );
}

/** Slide-over navigation: main links, shop-by-category and account actions (all screen sizes). */
export function NavSheet() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isOpen = useAppSelector(state => state.navigation.isMenuOpen);
  const categories = useAppSelector(state => state.category.storeCategories);
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );

  const close = () => dispatch(toggleMenu());

  return (
    <Sheet open={isOpen} onOpenChange={() => close()}>
      <SheetContent
        side='left'
        className='flex w-full flex-col gap-0 p-0 sm:max-w-sm'
      >
        <SheetHeader className='border-b border-foreground p-5'>
          <SheetTitle asChild>
            <div>
              <SiteLogo />
            </div>
          </SheetTitle>
          <SheetDescription className='sr-only'>
            Browse the shop, categories and your account.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className='min-h-0 flex-1'>
          <nav aria-label='Main' className='space-y-8 p-5'>
            <ul className='border-t border-border'>
              <li>
                <Link
                  href='/shop'
                  onClick={close}
                  className={bigLink(pathname === '/shop')}
                >
                  Shop all
                </Link>
              </li>
              <li>
                <Link
                  href='/brands'
                  onClick={close}
                  className={bigLink(pathname === '/brands')}
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  href='/sell'
                  onClick={close}
                  className={bigLink(pathname === '/sell')}
                >
                  Sell with us
                </Link>
              </li>
            </ul>

            {categories.length > 0 && (
              <Group title='Shop by category'>
                <ul>
                  {categories.map(category => {
                    const href = `/shop/category/${category.slug}`;
                    return (
                      <li key={category._id}>
                        <Link
                          href={href}
                          onClick={close}
                          aria-current={pathname === href ? 'page' : undefined}
                          className={smallLink(pathname === href)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Group>
            )}

            <Group title='Account'>
              <ul>
                {authenticated ? (
                  <>
                    <li>
                      <Link
                        href='/dashboard'
                        onClick={close}
                        className={smallLink(false)}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        type='button'
                        className={cn(smallLink(false), 'w-full text-left')}
                        onClick={() => {
                          close();
                          dispatch(signOut());
                        }}
                      >
                        Sign out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href='/login'
                        onClick={close}
                        className={smallLink(pathname === '/login')}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href='/register'
                        onClick={close}
                        className={smallLink(pathname === '/register')}
                      >
                        Sign up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </Group>
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
