import { ROLES, EMAIL_PROVIDER } from '@/lib/constants';

export const isProviderAllowed = (provider?: string | null) =>
  provider === EMAIL_PROVIDER.Google || provider === EMAIL_PROVIDER.Facebook;

type MaybeMerchantUser = {
  role?: string;
  merchant?: { isActive?: boolean } | null;
};

export const isDisabledMerchantAccount = (user: MaybeMerchantUser) =>
  user.role === ROLES.Merchant &&
  !!user.merchant &&
  user.merchant.isActive === false;
