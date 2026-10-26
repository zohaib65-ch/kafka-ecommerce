import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { WishlistItem } from '@/types';

export interface WishlistState {
  wishlist: WishlistItem[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  wishlist: [],
  isLoading: false
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<WishlistItem[]>) {
      state.wishlist = action.payload;
    },
    setWishlistLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const { setWishlist, setWishlistLoading } = wishlistSlice.actions;

export default wishlistSlice.reducer;
