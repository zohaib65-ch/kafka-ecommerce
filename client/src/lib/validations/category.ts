import { z } from 'zod';

import type { CategoryDetail } from '@/types';
import { descriptionField, requiredText, slugField } from './common';

/** `products` holds the selected product ids (see `product.productsSelect` for the options). */
const productsField = () =>
  z.array(z.string()).min(1, 'Products are required.');

export const addCategorySchema = z.object({
  name: requiredText('Name is required.'),
  description: descriptionField(),
  products: productsField(),
  isActive: z.boolean()
});
export type AddCategoryValues = z.infer<typeof addCategorySchema>;
export const addCategoryDefaultValues: AddCategoryValues = {
  name: '',
  description: '',
  products: [],
  isActive: true
};

/** Edit category. The "Active?" switch is not part of the form: it calls `activateCategory` directly. */
export const editCategorySchema = z.object({
  name: requiredText('Name is required.'),
  slug: slugField('Slug'),
  description: descriptionField(),
  products: productsField()
});
export type EditCategoryValues = z.infer<typeof editCategorySchema>;
export const categoryToFormValues = (
  category: CategoryDetail
): EditCategoryValues => ({
  name: category.name ?? '',
  slug: category.slug ?? '',
  description: category.description ?? '',
  products: (category.products ?? []).map(product => String(product.value))
});
