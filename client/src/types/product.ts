import type { BrandRef } from './brand';
import type { SelectOption } from './common';

export interface Product {
  _id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  imageKey?: string;
  /** Units in stock. */
  quantity: number;
  price: number;
  taxable: boolean;
  isActive: boolean;
  brand?: BrandRef | string | null;
  created?: string;
  updated?: string;
}

/** A product as listed in the shop (aggregation result of `GET /product/list`). */
export interface StoreListProduct extends Omit<Product, 'brand'> {
  brand?: BrandRef | null;
  /** Only present when signed in. */
  isLiked?: boolean;
  totalRatings?: number;
  totalReviews?: number;
  averageRating?: number;
}

/** A product page product (`GET /product/item/:slug`); `inventory` is a copy of the stock `quantity`. */
export interface StoreProduct extends Omit<Product, 'brand'> {
  brand?: BrandRef | null;
  inventory: number;
  isLiked?: boolean;
}

/**
 * The product being edited in the dashboard (`state.product.product`): `fetchProduct` turns
 * the populated brand into a select option (value `0` = no brand) and copies `quantity` to `inventory`.
 */
export type ProductDetail = Omit<Product, 'brand'> & {
  brand: SelectOption;
  inventory: number;
};

/** Row of the dashboard product list (brand populated with its merchant). */
export type ManagedProduct = Omit<Product, 'brand'> & {
  brand?:
    (BrandRef & { merchant?: { _id?: string; name?: string } | null }) | null;
};

/** Suggestion shown by the header search (`GET /product/list/search/:name`). */
export interface SearchSuggestion {
  name: string;
  slug: string;
  imageUrl?: string;
  price: number;
}

export interface AdvancedFilters {
  name: string;
  category: string;
  brand: string;
  min: number;
  max: number;
  rating: number;
  /** Index into `sortOptions` (0 newest, 1 price high to low, 2 price low to high). */
  order: number;
  totalPages: number;
  currentPage: number;
  count: number;
  limit: number;
}
