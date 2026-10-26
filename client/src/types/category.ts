import type { SelectOption } from './common';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  /** Product ids. */
  products: string[];
  created?: string;
  updated?: string;
}

/**
 * The category being edited (`state.category.category`): `fetchCategory` turns the populated
 * product list into select options.
 */
export type CategoryDetail = Omit<Category, 'products'> & {
  products: SelectOption<string>[];
};
