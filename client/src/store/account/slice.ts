import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { User } from '@/types';

export interface AccountState {
  user: User;
  isLoading: boolean;
}

const initialState: AccountState = {
  user: {
    firstName: '',
    lastName: '',
    provider: '',
    role: ''
  },
  isLoading: false
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    /** Merges profile data into the user (legacy FETCH_PROFILE). */
    setProfile(state, action: PayloadAction<User>) {
      state.user = { ...state.user, ...action.payload };
    },
    clearAccount(state) {
      state.user = { firstName: '', lastName: '' };
    },
    setProfileLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const { setProfile, clearAccount, setProfileLoading } =
  accountSlice.actions;

export default accountSlice.reducer;
