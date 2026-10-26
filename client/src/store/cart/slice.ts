import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { CartItem } from '@/types';

export interface CartState {
  cartItems: CartItem[];
  cartTotal: number;
  /** Id of the server side cart created at checkout ('' until then). */
  cartId: string;
}

const initialState: CartState = {
  cartItems: [],
  cartTotal: 0,
  cartId: ''
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      state.cartItems.push(action.payload);
    },
    removeItem(state, action: PayloadAction<string>) {
      const index = state.cartItems.findIndex(
        item => item._id === action.payload
      );
      if (index !== -1) state.cartItems.splice(index, 1);
    },
    setTotal(state, action: PayloadAction<number>) {
      state.cartTotal = action.payload;
    },
    /** Loads the cart persisted in localStorage. */
    hydrateCart(state, action: PayloadAction<CartState>) {
      state.cartItems = action.payload.cartItems;
      state.cartTotal = action.payload.cartTotal;
      state.cartId = action.payload.cartId;
    },
    cartIdSet(state, action: PayloadAction<string>) {
      state.cartId = action.payload;
    },
    resetCart(state) {
      state.cartItems = [];
      state.cartTotal = 0;
      state.cartId = '';
    }
  }
});

export const {
  addItem,
  removeItem,
  setTotal,
  hydrateCart,
  cartIdSet,
  resetCart
} = cartSlice.actions;

export default cartSlice.reducer;
