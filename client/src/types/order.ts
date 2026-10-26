import type { CART_ITEM_STATUS } from '@/lib/constants';
import type { BrandRef } from './brand';

export type CartItemStatus =
  (typeof CART_ITEM_STATUS)[keyof typeof CART_ITEM_STATUS];

export interface OrderItemProduct {
  _id: string;
  name: string;
  slug: string;
  sku?: string;
  imageUrl?: string;
  price: number;
  taxable?: boolean;
  brand?: BrandRef | null;
}

export interface OrderItem {
  _id: string;
  product: OrderItemProduct | null;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  priceWithTax: number;
  totalTax: number;
  status: CartItemStatus;
}

export interface Order {
  _id: string;
  /** Present on the single order response; used to update item statuses. */
  cartId?: string;
  created: string;
  total: number;
  totalTax?: number;
  totalWithTax?: number;
  products: OrderItem[];
}
