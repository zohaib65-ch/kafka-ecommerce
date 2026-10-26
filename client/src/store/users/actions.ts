import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import type { AppThunk } from '@/store';
import type { PageFilters, SearchFilter, UserListItem } from '@/types';
import {
  setSearchedUsers,
  setUserAdvancedFilters,
  setUserLoading,
  setUsers
} from './slice';

const USERS_PER_PAGE = 20;

// fetch users api (admin)
export const fetchUsers =
  (page?: number): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setUserLoading(true));
      const response = await axios.get<PageFilters & { users: UserListItem[] }>(
        `${API_URL}/user`,
        {
          params: {
            page: page ?? 1,
            limit: USERS_PER_PAGE
          }
        }
      );

      const { users, totalPages, currentPage, count } = response.data;

      dispatch(setUsers(users));
      dispatch(setUserAdvancedFilters({ totalPages, currentPage, count }));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };

// search users api (admin)
export const searchUsers =
  (filter: SearchFilter): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setUserLoading(true));

      const response = await axios.get<{ users: UserListItem[] }>(
        `${API_URL}/user/search`,
        {
          params: {
            search: filter.value
          }
        }
      );

      dispatch(setSearchedUsers(response.data.users));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setUserLoading(false));
    }
  };
