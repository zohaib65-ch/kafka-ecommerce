'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppSelector } from '@/store/hooks';

import { navLinkClass } from './nav-link-class';

/** "Brands" dropdown in the header: quick links to each brand plus a link to the full list. */
export function BrandsMenu() {
  const brands = useAppSelector(state => state.brand.storeBrands);

  if (brands.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navLinkClass()}>
        Brands <ChevronDown className='size-3.5' aria-hidden='true' />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='max-h-96 w-64 overflow-y-auto'
      >
        <DropdownMenuLabel className='meta'>Shop by brand</DropdownMenuLabel>
        {brands.map(brand => (
          <DropdownMenuItem key={brand._id} asChild>
            <Link href={`/shop/brand/${brand.slug}`}>{brand.name}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/brands' className='font-semibold'>
            See all brands →
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
