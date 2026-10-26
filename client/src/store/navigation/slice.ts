import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SearchSuggestion } from '@/types';

export interface NavigationState {
  isMenuOpen: boolean;
  isCartOpen: boolean;
  isBrandOpen: boolean;
  searchValue: string;
  searchSuggestions: SearchSuggestion[];
}

const initialState: NavigationState = {
  isMenuOpen: false,
  isCartOpen: false,
  isBrandOpen: false,
  searchValue: '',
  searchSuggestions: []
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    // The menu and cart drawers are mutually exclusive: opening one closes the other.
    toggleMenu(state) {
      state.isMenuOpen = !state.isMenuOpen;
      state.isCartOpen = false;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
      state.isMenuOpen = false;
    },
    toggleBrand(state) {
      state.isBrandOpen = !state.isBrandOpen;
    },
    /** Controlled variants for Sheet / Popover `onOpenChange` handlers. */
    setMenuOpen(state, action: PayloadAction<boolean>) {
      state.isMenuOpen = action.payload;
      if (action.payload) state.isCartOpen = false;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.isCartOpen = action.payload;
      if (action.payload) state.isMenuOpen = false;
    },
    setBrandOpen(state, action: PayloadAction<boolean>) {
      state.isBrandOpen = action.payload;
    },
    onSearch(state, action: PayloadAction<string>) {
      state.searchValue = action.payload;
    },
    setSearchSuggestions(state, action: PayloadAction<SearchSuggestion[]>) {
      state.searchSuggestions = action.payload;
    },
    onSuggestionsClearRequested(state) {
      state.searchSuggestions = [];
    }
  }
});

export const {
  toggleMenu,
  toggleCart,
  toggleBrand,
  setMenuOpen,
  setCartOpen,
  setBrandOpen,
  onSearch,
  setSearchSuggestions,
  onSuggestionsClearRequested
} = navigationSlice.actions;

export default navigationSlice.reducer;
