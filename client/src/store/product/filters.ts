import type { AdvancedFilters } from '@/types';

export const defaultAdvancedFilters: AdvancedFilters = {
  name: 'all',
  category: 'all',
  brand: 'all',
  min: 1,
  max: 2500,
  rating: 0,
  order: 0,
  totalPages: 1,
  currentPage: 1,
  count: 0,
  limit: 10
};

export type FilterValue = string | number | [number, number] | undefined;

/** Query sent to `GET /product/list` (before `sortOrder` is added). */
export interface ProductFilterQuery {
  name: string;
  category: string;
  brand: string;
  min: number;
  max: number;
  rating: number;
  order: number;
  page: number;
  limit: number;
}

/**
 * Builds the next query from the current filters and one change.
 * Changing the result set (category, brand, price, rating, or no filter at all) returns to the
 * first page; sorting keeps the current page; pagination goes to the requested page.
 * Unknown / missing names reset the category and brand to "all" (the shop landing page).
 */
export const productsFilterOrganizer = (
  n: string | undefined,
  v: FilterValue,
  s: AdvancedFilters
): ProductFilterQuery => {
  const base = {
    name: s.name,
    category: s.category,
    brand: s.brand,
    min: s.min,
    max: s.max,
    rating: s.rating,
    order: s.order,
    page: 1,
    limit: s.limit
  };

  switch (n) {
    case 'category':
      return { ...base, category: String(v), brand: 'all' };
    case 'brand':
      return { ...base, category: 'all', brand: String(v) };
    case 'sorting':
      return { ...base, order: Number(v), page: s.currentPage };
    case 'price': {
      const [min, max] = v as [number, number];
      return { ...base, min, max };
    }
    case 'rating':
      return { ...base, rating: Number(v) };
    case 'pagination':
      return { ...base, page: v === undefined ? s.currentPage : Number(v) };
    default:
      return { ...base, category: 'all', brand: 'all' };
  }
};

/** The filter fields of a query, as stored in `advancedFilters` (everything except `page`). */
export const toAdvancedFilters = (
  query: ProductFilterQuery
): Partial<AdvancedFilters> => ({
  name: query.name,
  category: query.category,
  brand: query.brand,
  min: query.min,
  max: query.max,
  rating: query.rating,
  order: query.order,
  limit: query.limit
});

/** Mongo sort document for an index of `sortOptions`. */
export const getSortOrder = (value: number): Record<string, 1 | -1> => {
  const sortOrder: Record<string, 1 | -1> = {};
  switch (value) {
    case 0:
      sortOrder._id = -1;
      break;
    case 1:
      sortOrder.price = -1;
      break;
    case 2:
      sortOrder.price = 1;
      break;

    default:
      break;
  }

  return sortOrder;
};
