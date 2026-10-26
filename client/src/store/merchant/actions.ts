import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import type {
  MerchantSignupValues,
  MerchantValues
} from '@/lib/validations/merchant';
import type { AppThunk } from '@/store';
import { signOut } from '@/store/login/actions';
import type {
  Merchant,
  MessageResponse,
  PageFilters,
  SearchFilter
} from '@/types';
import {
  setMerchantAdvancedFilters,
  setMerchantLoading,
  setMerchants,
  setSearchedMerchants
} from './slice';

const MERCHANTS_PER_PAGE = 20;

// add merchant (application) api; `isBack` goes back to the previous page on success
export const addMerchant =
  (values: MerchantValues, isBack = false): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      dispatch(setMerchantLoading(true));

      const response = await axios.post<MessageResponse>(
        `${API_URL}/merchant/add`,
        values
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        if (isBack) navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };

// fetch merchants api (admin)
export const fetchMerchants =
  (page?: number): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setMerchantLoading(true));

      const response = await axios.get<PageFilters & { merchants: Merchant[] }>(
        `${API_URL}/merchant`,
        {
          params: {
            page: page ?? 1,
            limit: MERCHANTS_PER_PAGE
          }
        }
      );

      const { merchants, totalPages, currentPage, count } = response.data;

      dispatch(setMerchants(merchants));

      dispatch(setMerchantAdvancedFilters({ totalPages, currentPage, count }));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };

// search merchants api (admin)
export const searchMerchants =
  (filter: SearchFilter): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setMerchantLoading(true));

      const response = await axios.get<{ merchants: Merchant[] }>(
        `${API_URL}/merchant/search`,
        {
          params: {
            search: filter.value
          }
        }
      );

      dispatch(setSearchedMerchants(response.data.merchants));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setMerchantLoading(false));
    }
  };

// Refreshes whichever list the admin is looking at: the search results or the current page.
const refreshMerchants =
  (search: string | undefined, page: number | undefined): AppThunk =>
  dispatch => {
    if (search) {
      // update search list if this is a search result
      dispatch(searchMerchants({ name: 'merchant', value: search }));
      return;
    }
    dispatch(fetchMerchants(page));
  };

// enable / disable a merchant account api (admin)
export const disableMerchant =
  (
    merchant: Pick<Merchant, '_id'>,
    value: boolean,
    search?: string,
    page?: number
  ): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      await axios.put(`${API_URL}/merchant/${merchant._id}/active`, {
        merchant: {
          isActive: value
        }
      });

      dispatch(refreshMerchants(search, page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

export const approveMerchant =
  (
    merchant: Pick<Merchant, '_id'>,
    search?: string,
    page?: number
  ): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      await axios.put(`${API_URL}/merchant/approve/${merchant._id}`);

      dispatch(refreshMerchants(search, page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

export const rejectMerchant =
  (
    merchant: Pick<Merchant, '_id'>,
    search?: string,
    page?: number
  ): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      await axios.put(`${API_URL}/merchant/reject/${merchant._id}`);

      dispatch(refreshMerchants(search, page));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// create the merchant account from the emailed invite api: signs out and goes to the login page
export const merchantSignUp =
  (token: string, values: MerchantSignupValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      await axios.post(`${API_URL}/merchant/signup/${token}`, values);

      dispatch(signOut());
      notify.success(
        'You have signed up successfully! Please sign in with the email and password. Thank you!'
      );
      navigation.push('/login');
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try to signup again!');
      return false;
    }
  };

// delete merchant api (admin)
export const deleteMerchant =
  (
    merchant: Pick<Merchant, '_id'>,
    search?: string,
    page?: number
  ): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/merchant/delete/${merchant._id}`
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);

        dispatch(refreshMerchants(search, page));
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
