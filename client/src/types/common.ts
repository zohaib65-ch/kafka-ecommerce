import type { SelectOption } from '@/lib/select';

export type { SelectOption };

/** Pagination info the API returns next to every paged list. */
export interface PageFilters {
  totalPages: number;
  currentPage: number;
  count: number;
}

/** Shape of a successful mutation response. */
export interface MessageResponse {
  success?: boolean;
  message?: string;
}

/** Argument the search thunks take (the legacy search bar passed `{ name, value }`). */
export interface SearchFilter {
  name?: string;
  value: string;
}
