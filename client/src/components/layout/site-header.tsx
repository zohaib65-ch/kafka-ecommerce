'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStoreBrands } from '@/store/brand/actions';
import { fetchStoreCategories } from '@/store/category/actions';
import { toggleCart, toggleMenu } from '@/store/navigation/actions';

import { BrandsMenu } from './brands-menu';
import { CartSheet } from './cart-sheet';
import { NavSheet } from './nav-sheet';
import { navLinkClass } from './nav-link-class';
import { SearchBox } from './search-box';
import { SiteLogo } from './site-logo';
import { ThemeToggle } from './theme-toggle';
import { UserMenu } from './user-menu';

export function SiteHeader() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const cartCount = useAppSelector(state => state.cart.cartItems.length);

  useEffect(() => {
    dispatch(fetchStoreBrands());
    dispatch(fetchStoreCategories());
  }, [dispatch]);

  const shopActive = pathname.startsWith('/shop');

  return (
    <>
      <header className='sticky top-0 z-40 border-b border-foreground bg-background'>
        <div className='container-page'>
          <div className='flex h-16 items-center gap-1 lg:gap-3'>
            <Button
              variant='ghost'
              size='icon'
              className='-ml-2.5'
              aria-label='Open the menu'
              onClick={() => dispatch(toggleMenu())}
            >
              <Menu className='size-5' />
            </Button>
            <SiteLogo />

            <div className='mx-6 hidden max-w-lg flex-1 md:block'>
              <SearchBox />
            </div>

            <nav
              aria-label='Primary'
              className='ml-auto hidden items-center lg:flex'
            >
              <Link
                href='/shop'
                className={navLinkClass(shopActive)}
                aria-current={shopActive ? 'page' : undefined}
              >
                Shop
              </Link>
              <BrandsMenu />
            </nav>

            <div className='ml-auto flex items-center gap-1 lg:ml-0'>
              <ThemeToggle />
              <UserMenu />
              <button
                type='button'
                className={`${navLinkClass()} gap-2 pr-0`}
                aria-label={
                  cartCount > 0
                    ? `Open your bag, ${cartCount} items`
                    : 'Open your bag, it is empty'
                }
                onClick={() => dispatch(toggleCart())}
              >
                <ShoppingBag className='size-[1.1rem]' aria-hidden='true' />
                <span className='hidden sm:inline'>Bag</span>
                <span
                  aria-hidden='true'
                  className={`grid h-5 min-w-5 place-items-center px-1 text-[0.7rem] font-bold ${
                    cartCount > 0
                      ? 'bg-brand text-brand-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {cartCount >= 99 ? '99+' : cartCount}
                </span>
              </button>
            </div>
          </div>

          <div className='pb-3 md:hidden'>
            <SearchBox />
          </div>
        </div>
      </header>

      <NavSheet />
      <CartSheet />
    </>
  );
}
