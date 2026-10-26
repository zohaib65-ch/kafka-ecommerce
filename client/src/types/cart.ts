import type { StoreProduct } from './product';

/**
 * A cart line as persisted in localStorage: the product page product with `quantity` replaced by
 * the purchased quantity (the stock count stays in `inventory`) plus the line total.
 */
export type CartItem = Omit<StoreProduct, 'quantity'> & {
  quantity: number;
  totalPrice: number;
};
