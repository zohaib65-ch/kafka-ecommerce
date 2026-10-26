'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { isProviderAllowed } from '@/lib/app-utils';
import { ROLES, type Role } from '@/lib/constants';
import { getDashboardRole } from '@/lib/dashboard-links';
import { useAppSelector } from '@/store/hooks';

type RoleGateProps = {
  /** Dashboard roles allowed to see the page (see getDashboardRole). */
  roles: Role[];
  /** Customers who signed in with Google/Facebook have no password: hide the security page. */
  hideForSocialProviders?: boolean;
  children: React.ReactNode;
};

/**
 * Page-level access check for dashboard routes. Users without access see the same "not found"
 * state the old router rendered for routes that did not exist for their role.
 */
export function RoleGate({
  roles,
  hideForSocialProviders,
  children
}: RoleGateProps) {
  const user = useAppSelector(state => state.account.user);
  const role = getDashboardRole(user);

  const blockedByProvider =
    hideForSocialProviders &&
    role === ROLES.Member &&
    isProviderAllowed(user.provider);

  if (!roles.includes(role) || blockedByProvider) {
    return (
      <EmptyState
        title='Page not found'
        description='The page you are looking for was not found.'
        action={
          <Button asChild variant='outline'>
            <Link href='/dashboard'>Back to dashboard</Link>
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
}
