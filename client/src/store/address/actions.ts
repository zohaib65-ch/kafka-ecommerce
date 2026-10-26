import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import type {
  AddAddressValues,
  EditAddressValues
} from '@/lib/validations/address';
import type { AppThunk } from '@/store';
import type { Address, MessageResponse } from '@/types';
import {
  addAddressToList,
  removeAddress,
  setAddressLoading,
  setAddresses
} from './slice';

export const fetchAddresses = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    dispatch(setAddressLoading(true));
    const response = await axios.get<{ addresses: Address[] }>(
      `${API_URL}/address`
    );
    dispatch(setAddresses(response.data.addresses));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setAddressLoading(false));
  }
};

// add address api: goes back to the previous page on success
export const addAddress =
  (values: AddAddressValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse & { address: Address }>(
        `${API_URL}/address/add`,
        values
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(addAddressToList(response.data.address));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// update address api: goes back to the previous page on success
export const updateAddress =
  (id: string, values: EditAddressValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.put<MessageResponse>(
        `${API_URL}/address/${id}`,
        values
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// delete address api: goes back to the previous page on success
export const deleteAddress =
  (id: string): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/address/delete/${id}`
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(removeAddress(id));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
