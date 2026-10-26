import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Brand, SelectOption } from '@/types';
import { removeById } from '../utils';

export interface BrandState {
  /** Dashboard list. */
  brands: Brand[];
  /** Active brands shown in the store navigation. */
  storeBrands: Brand[];
  /** The brand being edited (`null` until `fetchBrand` resolves). */
  brand: Brand | null;
  /** Select options; the first one is `{ value: 0, label: 'No option selected' }`. */
  brandsSelect: SelectOption[];
  isLoading: boolean;
}

const initialState: BrandState = {
  brands: [],
  storeBrands: [],
  brand: null,
  brandsSelect: [],
  isLoading: false
};

const brandSlice = createSlice({
  name: 'brand',
  initialState,
  reducers: {
    setBrands(state, action: PayloadAction<Brand[]>) {
      state.brands = action.payload;
    },
    setStoreBrands(state, action: PayloadAction<Brand[]>) {
      state.storeBrands = action.payload;
    },
    setBrand(state, action: PayloadAction<Brand | null>) {
      state.brand = action.payload;
    },
    setBrandsSelect(state, action: PayloadAction<SelectOption[]>) {
      state.brandsSelect = action.payload;
    },
    addBrandToList(state, action: PayloadAction<Brand>) {
      state.brands.push(action.payload);
    },
    removeBrand(state, action: PayloadAction<string>) {
      state.brands = removeById(state.brands, action.payload);
    },
    setBrandsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setBrands,
  setStoreBrands,
  setBrand,
  setBrandsSelect,
  addBrandToList,
  removeBrand,
  setBrandsLoading
} = brandSlice.actions;

export default brandSlice.reducer;
