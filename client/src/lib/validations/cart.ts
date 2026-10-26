import { z } from 'zod';

/**
 * Most units of a product a customer may buy at once, based on the stock (`inventory`).
 * (Legacy `calculatePurchaseQuantity`.)
 */
export const getMaxPurchaseQuantity = (inventory: number): number => {
  if (inventory <= 25) {
    return 1;
  } else if (inventory > 25 && inventory <= 100) {
    return 5;
  } else if (inventory > 100 && inventory < 500) {
    return 25;
  } else {
    return 50;
  }
};

/**
 * Quantity input of the product page ("Add To Bag"). `quantity` is a numeric string; the
 * allowed range depends on the product stock, hence the factory.
 */
export const createQuantitySchema = (inventory: number) => {
  const max = getMaxPurchaseQuantity(inventory);

  return z.object({
    quantity: z
      .string()
      .refine(value => Number(value) >= 1, 'Quantity must be at least 1.')
      .refine(
        value => Number(value) <= max,
        `Quantity may not be greater than ${max}.`
      )
  });
};
export type QuantityValues = z.infer<ReturnType<typeof createQuantitySchema>>;
export const quantityDefaultValues: QuantityValues = { quantity: '1' };
