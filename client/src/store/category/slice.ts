import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Category, CategoryDetail } from '@/types';
import { removeById } from '../utils';

export interface CategoryState {
  /** Dashboard list. */
  categories: Category[];
  /** Active categories shown in the store navigation. */
  storeCategories: Category[];
  /** The category being edited (`null` until `fetchCategory` resolves). */
  category: CategoryDetail | null;
  isLoading: boolean;
}

const initialState: CategoryState = {
  categories: [],
  storeCategories: [],
  category: null,
  isLoading: false
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
    setStoreCategories(state, action: PayloadAction<Category[]>) {
      state.storeCategories = action.payload;
    },
    setCategory(state, action: PayloadAction<CategoryDetail | null>) {
      state.category = action.payload;
    },
    addCategoryToList(state, action: PayloadAction<Category>) {
      state.categories.push(action.payload);
    },
    removeCategory(state, action: PayloadAction<string>) {
      state.categories = removeById(state.categories, action.payload);
    },
    setCategoriesLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    /** Clears the category being edited (legacy RESET_CATEGORY). */
    resetCategory(state) {
      state.category = null;
    }
  }
});

export const {
  setCategories,
  setStoreCategories,
  setCategory,
  addCategoryToList,
  removeCategory,
  setCategoriesLoading,
  resetCategory
} = categorySlice.actions;

export default categorySlice.reducer;
