'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROLES } from '@/lib/constants';
import { isProviderAllowed } from '@/lib/app-utils';
import {
  dashboardLinks,
  getDashboardRole,
  type DashboardLink
} from '@/lib/dashboard-links';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';

const roleLabel = {
  [ROLES.Admin]: 'Administrator',
  [ROLES.Merchant]: 'Merchant',
  [ROLES.Member]: 'Customer'
};

/** Whether a dashboard link applies to this user's sign-in provider (legacy AccountMenu rule). */
const isLinkAllowed = (link: DashboardLink, provider?: string | null) => {
  if (!link.provider) return true;
  if (!provider) return true;
  return link.provider.includes(provider);
};

function useDashboardLinks() {
  const user = useAppSelector(state => state.account.user);
  const role = getDashboardRole(user);

  // Customers who signed in with Google/Facebook have no password to manage.
  const links = dashboardLinks[role].filter(link => {
    if (!isLinkAllowed(link, user.provider)) return false;
    if (role === ROLES.Member && link.to === '/security') {
      return !isProviderAllowed(user.provider);
    }
    return true;
  });

  return { user, role, links };
}

/** Sidebar on large screens, scrollable tab bar on small screens. */
export function DashboardNav() {
  const pathname = usePathname();
  const { user, role, links } = useDashboardLinks();

  const isActive = (href: string, exact: boolean) =>
    exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className='lg:sticky lg:top-24 lg:self-start'>
      <div className='hidden border-b border-foreground pb-4 lg:block'>
        <p className='font-heading text-3xl leading-none font-semibold uppercase'>
          {user.firstName
            ? `${user.firstName} ${user.lastName ?? ''}`
            : 'My account'}
        </p>
        <p className='meta mt-2'>{roleLabel[role]}</p>
      </div>

      <nav
        aria-label='Dashboard'
        className='-mx-5 scrollbar-thin overflow-x-auto border-b px-5 md:-mx-8 md:px-8 lg:mx-0 lg:border-b-0 lg:px-0'
      >
        <ul className='flex gap-6 lg:flex-col lg:gap-0'>
          {links.map(link => {
            const href = `${link.prefix ?? ''}${link.to}`;
            const active = isActive(href, link.to === '');
            return (
              <li key={href} className='shrink-0'>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    '-mb-px block border-b-2 py-3 text-[0.8rem] font-semibold tracking-[0.08em] whitespace-nowrap uppercase transition-colors lg:mb-0 lg:flex lg:items-center lg:justify-between lg:border-b lg:border-b-border lg:py-2.5',
                    active
                      ? 'border-brand text-foreground lg:border-b-foreground lg:bg-accent lg:px-3'
                      : 'border-transparent text-muted-foreground hover:text-foreground lg:hover:px-3'
                  )}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
