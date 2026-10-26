import { EMAIL_PROVIDER, ROLES, type Role } from '@/lib/constants';

export type DashboardLink = {
  /** Path segment appended to `prefix` (empty for the dashboard home). */
  to: string;
  name: string;
  prefix?: string;
  /** When set, the link is only shown to users whose sign-in provider is listed. */
  provider?: string[];
  icon:
    | 'account'
    | 'security'
    | 'address'
    | 'product'
    | 'category'
    | 'brand'
    | 'users'
    | 'merchant'
    | 'orders'
    | 'review'
    | 'wishlist'
    | 'support';
};

const account: DashboardLink = {
  to: '',
  name: 'Account Details',
  prefix: '/dashboard',
  icon: 'account'
};
const security: DashboardLink = {
  to: '/security',
  name: 'Account Security',
  prefix: '/dashboard',
  provider: [EMAIL_PROVIDER.Email],
  icon: 'security'
};
const address: DashboardLink = {
  to: '/address',
  name: 'Address',
  prefix: '/dashboard',
  icon: 'address'
};
const orders: DashboardLink = {
  to: '/orders',
  name: 'Orders',
  prefix: '/dashboard',
  icon: 'orders'
};
const wishlist: DashboardLink = {
  to: '/wishlist',
  name: 'WishList',
  prefix: '/dashboard',
  icon: 'wishlist'
};
const support: DashboardLink = {
  to: '/support',
  name: 'Support',
  icon: 'support'
};

export const dashboardLinks: Record<Role, DashboardLink[]> = {
  [ROLES.Admin]: [
    account,
    security,
    address,
    { to: '/product', name: 'Products', prefix: '/dashboard', icon: 'product' },
    {
      to: '/category',
      name: 'Categories',
      prefix: '/dashboard',
      icon: 'category'
    },
    { to: '/brand', name: 'Brand', prefix: '/dashboard', icon: 'brand' },
    { to: '/users', name: 'Users', prefix: '/dashboard', icon: 'users' },
    {
      to: '/merchant',
      name: 'Merchants',
      prefix: '/dashboard',
      icon: 'merchant'
    },
    orders,
    { to: '/review', name: 'Reviews', prefix: '/dashboard', icon: 'review' },
    wishlist,
    support
  ],
  [ROLES.Merchant]: [
    account,
    security,
    address,
    { to: '/brand', name: 'Brand', prefix: '/dashboard', icon: 'brand' },
    { to: '/product', name: 'Products', prefix: '/dashboard', icon: 'product' },
    orders,
    wishlist,
    support
  ],
  [ROLES.Member]: [account, security, address, orders, wishlist, support]
};

type DashboardUser = { role?: string; merchant?: unknown };

/**
 * The role whose dashboard a user sees. A merchant account that has no linked merchant record
 * (yet) gets the customer dashboard, exactly like before the migration.
 */
export const getDashboardRole = (user: DashboardUser): Role => {
  if (user.role === ROLES.Admin) return ROLES.Admin;
  if (user.role === ROLES.Merchant && user.merchant) return ROLES.Merchant;
  return ROLES.Member;
};
