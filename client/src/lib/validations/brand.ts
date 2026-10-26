import { z } from 'zod';

import type { Brand } from '@/types';
import { descriptionField, requiredText, slugField } from './common';

export const addBrandSchema = z.object({
  name: requiredText('Name is required.'),
  description: descriptionField(),
  isActive: z.boolean()
});
export type AddBrandValues = z.infer<typeof addBrandSchema>;
export const addBrandDefaultValues: AddBrandValues = {
  name: '',
  description: '',
  isActive: true
};

/** Edit brand. The "Active?" switch is not part of the form: it calls `activateBrand` directly. */
export const editBrandSchema = z.object({
  name: requiredText('Name is required.'),
  slug: slugField('Slug'),
  description: descriptionField()
});
export type EditBrandValues = z.infer<typeof editBrandSchema>;
export const brandToFormValues = (brand: Brand): EditBrandValues => ({
  name: brand.name ?? '',
  slug: brand.slug ?? '',
  description: brand.description ?? ''
});
