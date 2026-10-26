import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  AdvancedFilters,
  ManagedProduct,
  ProductDetail,
  SelectOption,
  StoreListProduct,
  StoreProduct
} from '@/types';
import { removeById } from '../utils';
import { defaultAdvancedFilters } from './filters';

export interface ProductState {
  /** Dashboard list. */
  products: ManagedProduct[];
  /** Current page of the shop (filtered, sorted, paginated). */
  storeProducts: StoreListProduct[];
  /** The product being edited in the dashboard (`null` until `fetchProduct` resolves). */
  product: ProductDetail | null;
  /** The product page product (`null` until `fetchStoreProduct` resolves). */
  storeProduct: StoreProduct | null;
  /** Select options of every product (used to pick a category's products). */
  productsSelect: SelectOption[];
  isLoading: boolean;
  advancedFilters: AdvancedFilters;
}

const initialState: ProductState = {
  products: [],
  storeProducts: [],
  product: null,
  storeProduct: null,
  productsSelect: [],
  isLoading: false,
  advancedFilters: defaultAdvancedFilters
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<ManagedProduct[]>) {
      state.products = action.payload;
    },
    setStoreProducts(state, action: PayloadAction<StoreListProduct[]>) {
      state.storeProducts = action.payload;
    },
    setProduct(state, action: PayloadAction<ProductDetail | null>) {
      state.product = action.payload;
    },
    setStoreProduct(state, action: PayloadAction<StoreProduct | null>) {
      state.storeProduct = action.payload;
    },
    setProductsSelect(state, action: PayloadAction<SelectOption[]>) {
      state.productsSelect = action.payload;
    },
    addProductToList(state, action: PayloadAction<ManagedProduct>) {
      state.products.push(action.payload);
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.products = removeById(state.products, action.payload);
    },
    setProductLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAdvancedFilters(state, action: PayloadAction<Partial<AdvancedFilters>>) {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    resetAdvancedFilters(state) {
      state.advancedFilters = defaultAdvancedFilters;
    },
    /** Clears the product being edited (legacy RESET_PRODUCT). */
    resetProduct(state) {
      state.product = null;
    },
    /** Keeps shop lists and the product page in sync after a wishlist change. */
    setProductLiked(
      state,
      action: PayloadAction<{ id: string; isLiked: boolean }>
    ) {
      const { id, isLiked } = action.payload;
      state.storeProducts.forEach(product => {
        if (product._id === id) product.isLiked = isLiked;
      });
      if (state.storeProduct && state.storeProduct._id === id) {
        state.storeProduct.isLiked = isLiked;
      }
    }
  }
});

export const {
  setProducts,
  setStoreProducts,
  setProduct,
  setStoreProduct,
  setProductsSelect,
  addProductToList,
  removeProduct,
  setProductLoading,
  setAdvancedFilters,
  resetAdvancedFilters,
  resetProduct,
  setProductLiked
} = productSlice.actions;

export default productSlice.reducer;
