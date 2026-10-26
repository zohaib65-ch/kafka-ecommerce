// Browser-visible configuration. NEXT_PUBLIC_* values are inlined at build time
// (see next.config.ts, which also accepts the legacy API_URL name).
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

// The Socket.IO server is the API server. Defaults to the API origin without the /api suffix,
// and can be overridden with NEXT_PUBLIC_SOCKET_URL.
export const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL)
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  try {
    return new URL(API_URL).origin;
  } catch {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }
};

export const SITE_NAME = 'Marketlane';
export const SITE_DESCRIPTION =
  'Shop thousands of products from trusted brands and independent merchants, with free shipping on every order.';
export const SUPPORT_PHONE = '951-999-9999';

export const ROLES = {
  Admin: 'ROLE ADMIN',
  Member: 'ROLE MEMBER',
  Merchant: 'ROLE MERCHANT'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const CART_ITEMS = 'cart_items';
export const CART_TOTAL = 'cart_total';
export const CART_ID = 'cart_id';

export const CART_ITEM_STATUS = {
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Not_processed: 'Not processed'
} as const;

export const MERCHANT_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
} as const;

export const REVIEW_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
} as const;

export const EMAIL_PROVIDER = {
  Email: 'Email',
  Google: 'Google',
  Facebook: 'Facebook'
} as const;

export const TOKEN_KEY = 'token';
