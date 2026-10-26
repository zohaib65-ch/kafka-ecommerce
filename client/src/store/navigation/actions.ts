import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import type { AppThunk } from '@/store';
import type { SearchSuggestion } from '@/types';
import { setSearchSuggestions } from './slice';

export {
  toggleMenu,
  toggleCart,
  setCartOpen,
  onSearch,
  onSuggestionsClearRequested
} from './slice';

export const MIN_SEARCH_LENGTH = 2;

// The API matches the term as a regular expression: escape it so "(" or "." search literally.
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Fetches product suggestions for the header search. Takes `{ value }` like the legacy
 * react-autosuggest handler. Terms shorter than MIN_SEARCH_LENGTH only clear the suggestions;
 * debounce in the UI (the legacy "every 3rd character" throttle is gone).
 */
export const onSuggestionsFetchRequested =
  ({ value }: { value: string }): AppThunk<Promise<void>> =>
  async dispatch => {
    const inputValue = value.trim().toLowerCase();

    try {
      if (inputValue.length >= MIN_SEARCH_LENGTH) {
        const response = await axios.get<{ products: SearchSuggestion[] }>(
          `${API_URL}/product/list/search/${encodeURIComponent(
            escapeRegExp(inputValue)
          )}`
        );
        dispatch(setSearchSuggestions(response.data.products));
      } else {
        dispatch(setSearchSuggestions([]));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
