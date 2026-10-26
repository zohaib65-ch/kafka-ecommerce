import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItemStatus, Order, PageFilters } from '@/types';

export interface OrderState {
  orders: Order[];
  searchedOrders: Order[];
  /** The order being viewed (`null` until `fetchOrder` resolves). */
  order: Order | null;
  isLoading: boolean;
  advancedFilters: PageFilters;
}

const initialState: OrderState = {
  orders: [],
  searchedOrders: [],
  order: null,
  isLoading: false,
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  }
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      state.orders = action.payload;
    },
    setSearchedOrders(state, action: PayloadAction<Order[]>) {
      state.searchedOrders = action.payload;
    },
    setOrder(state, action: PayloadAction<Order | null>) {
      state.order = action.payload;
    },
    setOrderAdvancedFilters(state, action: PayloadAction<PageFilters>) {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    /** Sets the status of one item of the order being viewed (legacy UPDATE_ORDER_STATUS). */
    updateOrderStatus(
      state,
      action: PayloadAction<{ itemId: string; status: CartItemStatus }>
    ) {
      const item = state.order?.products.find(
        product => product._id === action.payload.itemId
      );
      if (item) item.status = action.payload.status;
    },
    setOrderLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
    }
  }
});

export const {
  setOrders,
  setSearchedOrders,
  setOrder,
  setOrderAdvancedFilters,
  updateOrderStatus,
  setOrderLoading,
  clearOrders
} = orderSlice.actions;

export default orderSlice.reducer;
