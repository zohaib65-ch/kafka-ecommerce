import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { PageFilters, UserListItem } from '@/types';

export interface UsersState {
  users: UserListItem[];
  searchedUsers: UserListItem[];
  advancedFilters: PageFilters;
  isLoading: boolean;
}

const initialState: UsersState = {
  users: [],
  searchedUsers: [],
  advancedFilters: {
    totalPages: 1,
    currentPage: 1,
    count: 0
  },
  isLoading: false
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<UserListItem[]>) {
      state.users = action.payload;
    },
    setSearchedUsers(state, action: PayloadAction<UserListItem[]>) {
      state.searchedUsers = action.payload;
    },
    setUserAdvancedFilters(state, action: PayloadAction<PageFilters>) {
      state.advancedFilters = { ...state.advancedFilters, ...action.payload };
    },
    setUserLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    }
  }
});

export const {
  setUsers,
  setSearchedUsers,
  setUserAdvancedFilters,
  setUserLoading
} = usersSlice.actions;

export default usersSlice.reducer;
