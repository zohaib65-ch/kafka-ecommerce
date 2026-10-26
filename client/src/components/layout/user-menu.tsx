'use client';

import Link from 'next/link';
import { ChevronDown, LogIn, LogOut, UserRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signOut } from '@/store/login/actions';

import { navLinkClass } from './nav-link-class';

export function UserMenu() {
  const dispatch = useAppDispatch();
  const authenticated = useAppSelector(
    state => state.authentication.authenticated
  );
  const user = useAppSelector(state => state.account.user);

  if (!authenticated) {
    return (
      <>
        <div className='hidden items-center gap-1 lg:flex'>
          <Link href='/login' className={navLinkClass()}>
            Login
          </Link>
          <Button asChild size='sm'>
            <Link href='/register'>Sign up</Link>
          </Button>
        </div>
        <Button asChild variant='ghost' size='icon' className='lg:hidden'>
          <Link href='/login' aria-label='Login'>
            <LogIn className='size-[1.1rem]' />
          </Link>
        </Button>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={navLinkClass()} aria-label='Account menu'>
        <UserRound className='size-[1.1rem] lg:hidden' aria-hidden='true' />
        <span className='hidden max-w-32 truncate lg:inline'>
          {user.firstName || 'Account'}
        </span>
        <ChevronDown className='hidden size-3.5 lg:block' aria-hidden='true' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel className='font-normal'>
          <span className='block truncate font-semibold'>
            {user.firstName} {user.lastName}
          </span>
          {user.email && (
            <span className='block truncate text-xs text-muted-foreground'>
              {user.email}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/dashboard'>Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/dashboard/orders'>Orders</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href='/support'>Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant='destructive'
          onClick={() => dispatch(signOut())}
        >
          <LogOut /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
