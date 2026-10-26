import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Merchant, PageFilters } from '@/types';
import { removeById } from '../utils';

export interface MerchantState {
  merchants: Merchant[];
  searchedMerchants: Merchant[];
  advancedFilters: PageFilters;
  isLoading: boolean;
}

const initialState: MerchantState = {
  merchants: [],
  searchedMerchants: [],
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  isLoading: false
};

const merchantSlice = createSlice({
  name: 'merchant',
  initialState,
  reducers: {
    setMerchants(state, action: PayloadAction<Merchant[]>) {
      state.merchants = action.payload;
    },
    setSearchedMerchants(state, action: PayloadAction<Merchant[]>) {
      state.searchedMerchants = action.payload;
    },
    removeMerchant(state, action: PayloadAction<string>) {
      state.merchants = removeById(state.merchants, action.payload);
    },
    setMerchantAdvancedFilters(state, action: PayloadAction<PageFilters>) {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    setMerchantLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setMerchants,
  setSearchedMerchants,
  removeMerchant,
  setMerchantAdvancedFilters,
  setMerchantLoading
} = merchantSlice.actions;

export default merchantSlice.reducer;
