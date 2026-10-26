import { describe, expect, it } from 'vitest';

import type { AdvancedFilters } from '@/types';
import {
  defaultAdvancedFilters,
  getSortOrder,
  productsFilterOrganizer,
  toAdvancedFilters
} from './filters';

const state: AdvancedFilters = {
  ...defaultAdvancedFilters,
  category: 'shoes',
  brand: 'acme',
  min: 10,
  max: 500,
  rating: 3,
  order: 2,
  currentPage: 3,
  totalPages: 5,
  count: 48
};

describe('productsFilterOrganizer', () => {
  it('category resets the brand and returns to the first page', () => {
    expect(productsFilterOrganizer('category', 'hats', state)).toEqual({
      name: 'all',
      category: 'hats',
      brand: 'all',
      min: 10,
      max: 500,
      rating: 3,
      order: 2,
      page: 1,
      limit: 10
    });
  });

  it('brand resets the category', () => {
    const query = productsFilterOrganizer('brand', 'zeta', state);
    expect(query.category).toBe('all');
    expect(query.brand).toBe('zeta');
    expect(query.page).toBe(1);
  });

  it('sorting keeps the filters and the current page', () => {
    const query = productsFilterOrganizer('sorting', 1, state);
    expect(query.order).toBe(1);
    expect(query.category).toBe('shoes');
    expect(query.page).toBe(3);
  });

  it('price and rating change one filter', () => {
    expect(productsFilterOrganizer('price', [5, 99], state)).toMatchObject({
      min: 5,
      max: 99,
      rating: 3,
      page: 1
    });
    expect(productsFilterOrganizer('rating', 4, state)).toMatchObject({
      min: 10,
      rating: 4,
      page: 1
    });
  });

  it('pagination goes to the requested page (or stays)', () => {
    expect(productsFilterOrganizer('pagination', 2, state).page).toBe(2);
    expect(productsFilterOrganizer('pagination', undefined, state).page).toBe(
      3
    );
  });

  it('no filter resets the category and brand', () => {
    const query = productsFilterOrganizer(undefined, undefined, state);
    expect(query).toMatchObject({
      category: 'all',
      brand: 'all',
      page: 1,
      rating: 3
    });
  });

  it('keeps the page out of the stored filters', () => {
    const stored = toAdvancedFilters(
      productsFilterOrganizer('pagination', 2, state)
    );
    expect(stored).not.toHaveProperty('page');
    expect(stored).toMatchObject({ category: 'shoes', limit: 10 });
  });
});

describe('getSortOrder', () => {
  it('maps the sort option index to a mongo sort', () => {
    expect(getSortOrder(0)).toEqual({ _id: -1 });
    expect(getSortOrder(1)).toEqual({ price: -1 });
    expect(getSortOrder(2)).toEqual({ price: 1 });
    expect(getSortOrder(9)).toEqual({});
  });
});
