import type { MERCHANT_STATUS } from '@/lib/constants';

export type MerchantStatus =
  (typeof MERCHANT_STATUS)[keyof typeof MERCHANT_STATUS];

export interface Merchant {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  brandName: string;
  business: string;
  isActive: boolean;
  status: MerchantStatus;
  brand?: { _id?: string; name: string } | null;
  created?: string;
  updated?: string;
}
