import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import { formatSelectOptions } from '@/lib/select';
import type { AddBrandValues, EditBrandValues } from '@/lib/validations/brand';
import type { AppThunk } from '@/store';
import type { Brand, MessageResponse } from '@/types';
import {
  addBrandToList,
  removeBrand,
  setBrand,
  setBrands,
  setBrandsLoading,
  setBrandsSelect,
  setStoreBrands
} from './slice';

// fetch store brands api
export const fetchStoreBrands =
  (): AppThunk<Promise<void>> => async dispatch => {
    try {
      const response = await axios.get<{ brands: Brand[] }>(
        `${API_URL}/brand/list`
      );

      dispatch(setStoreBrands(response.data.brands));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// fetch brands api
export const fetchBrands = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    dispatch(setBrandsLoading(true));

    const response = await axios.get<{ brands: Brand[] }>(`${API_URL}/brand`);

    dispatch(setBrands(response.data.brands));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setBrandsLoading(false));
  }
};

// fetch brand api
export const fetchBrand =
  (brandId: string): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      const response = await axios.get<{ brand: Brand }>(
        `${API_URL}/brand/${brandId}`
      );

      dispatch(setBrand(response.data.brand));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// fetch brands select api
export const fetchBrandsSelect =
  (): AppThunk<Promise<void>> => async dispatch => {
    try {
      const response = await axios.get<{ brands: Brand[] }>(
        `${API_URL}/brand/list/select`
      );

      const formattedBrands = formatSelectOptions(response.data.brands, true);

      dispatch(setBrandsSelect(formattedBrands));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// add brand api: goes back to the previous page on success
export const addBrand =
  (values: AddBrandValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse & { brand: Brand }>(
        `${API_URL}/brand/add`,
        values
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(addBrandToList(response.data.brand));

        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// update brand api: goes back to the previous page on success
export const updateBrand =
  (id: string, values: EditBrandValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const newBrand = {
        name: values.name,
        slug: values.slug,
        description: values.description
      };

      const response = await axios.put<MessageResponse>(
        `${API_URL}/brand/${id}`,
        { brand: newBrand }
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

// activate brand api: reloads the brand being edited on success
export const activateBrand =
  (id: string, value: boolean): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    try {
      const response = await axios.put<MessageResponse>(
        `${API_URL}/brand/${id}/active`,
        {
          brand: {
            isActive: value
          }
        }
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);

        const brand = getState().brand.brand;
        if (brand) dispatch(fetchBrand(brand._id));
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// delete brand api: goes back to the previous page on success
export const deleteBrand =
  (id: string): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/brand/delete/${id}`
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(removeBrand(id));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
