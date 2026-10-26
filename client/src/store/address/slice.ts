import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { Address } from '@/types';
import { removeById } from '../utils';

export interface AddressState {
  addresses: Address[];
  /** The address being edited (`null` until `fetchAddress` resolves). */
  address: Address | null;
  isLoading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  address: null,
  isLoading: false
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddresses(state, action: PayloadAction<Address[]>) {
      state.addresses = action.payload;
    },
    setAddress(state, action: PayloadAction<Address | null>) {
      state.address = action.payload;
    },
    addAddressToList(state, action: PayloadAction<Address>) {
      state.addresses.push(action.payload);
    },
    removeAddress(state, action: PayloadAction<string>) {
      state.addresses = removeById(state.addresses, action.payload);
    },
    setAddressLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setAddresses,
  setAddress,
  addAddressToList,
  removeAddress,
  setAddressLoading
} = addressSlice.actions;

export default addressSlice.reducer;
