import { z } from 'zod';

import type { ProductDetail } from '@/types';
import {
  ALPHA_DASH_MESSAGE,
  ALPHA_DASH_REGEX,
  descriptionField,
  requiredText,
  slugField,
  yesNoField,
  yesNoOptions
} from './common';

export { yesNoOptions as taxableOptions };

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

const skuField = () =>
  requiredText('Sku is required.').regex(
    ALPHA_DASH_REGEX,
    `Sku ${ALPHA_DASH_MESSAGE}`
  );

// Number-like inputs are strings in the form (see common.ts); thunks convert them.
const quantityField = () =>
  requiredText('Quantity is required.').refine(
    value =>
      value === '' || (Number.isInteger(Number(value)) && Number(value) >= 0),
    'Quantity must be a whole number.'
  );

const priceField = () =>
  requiredText('Price is required.')
    .refine(
      value => value === '' || Number.isFinite(Number(value)),
      'Price must be a number.'
    )
    .refine(
      value => !Number.isFinite(Number(value)) || Number(value) >= 0,
      'Price may not be negative.'
    );

/** Select value meaning "no brand" (the `0` option of `brand.brandsSelect`). */
export const NO_BRAND_VALUE = '0';

/**
 * Add product (dashboard).
 *  - `quantity`, `price`: numeric strings.
 *  - `taxable`: '1' (Yes) | '0' (No).
 *  - `brand`: a brand id; the "no option selected" value '0' is rejected. Merchants are locked to
 *    their own brand, so the UI should pre-fill `brandsSelect[1].value` (the thunk enforces it too).
 *  - `image`: required jpg / jpeg / png `File`.
 */
export const addProductSchema = z.object({
  sku: skuField(),
  name: requiredText('Name is required.'),
  description: descriptionField(),
  quantity: quantityField(),
  price: priceField(),
  taxable: yesNoField('Taxable is required.'),
  brand: requiredText('Brand is required.').refine(
    value => value !== NO_BRAND_VALUE,
    'Brand is required.'
  ),
  image: z.custom<File>(
    value =>
      typeof File !== 'undefined' &&
      value instanceof File &&
      ACCEPTED_IMAGE_TYPES.includes(value.type),
    { message: 'Please upload files with jpg, jpeg, png format.' }
  ),
  isActive: z.boolean()
});
export type AddProductValues = z.infer<typeof addProductSchema>;
/** `image` has no default: it is `undefined` until a file is chosen. */
export const addProductDefaultValues: Partial<AddProductValues> = {
  sku: '',
  name: '',
  description: '',
  quantity: '1',
  price: '1',
  taxable: '0',
  brand: NO_BRAND_VALUE,
  isActive: true
};

/**
 * Edit product. The "Active?" switch is not part of the form: it calls `activateProduct` directly.
 * `brand` may be '0' ("No option selected"), which detaches the product from its brand.
 */
export const editProductSchema = z.object({
  name: requiredText('Name is required.'),
  sku: skuField(),
  slug: slugField('Slug'),
  description: descriptionField(),
  quantity: quantityField(),
  price: priceField(),
  taxable: yesNoField('Taxable is required.'),
  brand: requiredText('Brand is required.')
});
export type EditProductValues = z.infer<typeof editProductSchema>;
export const productToFormValues = (
  product: ProductDetail
): EditProductValues => ({
  name: product.name ?? '',
  sku: product.sku ?? '',
  slug: product.slug ?? '',
  description: product.description ?? '',
  quantity: String(product.quantity ?? ''),
  price: String(product.price ?? ''),
  taxable: product.taxable ? '1' : '0',
  brand: String(product.brand?.value ?? NO_BRAND_VALUE)
});
