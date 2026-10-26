import type { EMAIL_PROVIDER, Role } from '@/lib/constants';
import type { Merchant } from './merchant';

export type AuthProvider = (typeof EMAIL_PROVIDER)[keyof typeof EMAIL_PROVIDER];

/** The signed in user (`GET /user/me`, kept in `state.account.user`). */
export interface User {
  _id?: string;
  id?: string;
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  provider?: AuthProvider | '';
  role?: Role | '';
  /** Populated (with its brand) by `GET /user/me`. */
  merchant?: (Merchant & { brand?: Merchant['brand'] }) | null;
  avatar?: string;
  created?: string;
  updated?: string;
}

/** A row of the admin user list (`GET /user`, which omits the id and password). */
export interface UserListItem {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  provider?: AuthProvider;
  role?: Role;
  merchant?: { _id?: string; name: string } | null;
  created?: string;
}
