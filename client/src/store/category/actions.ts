import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import { formatSelectOptions } from '@/lib/select';
import type {
  AddCategoryValues,
  EditCategoryValues
} from '@/lib/validations/category';
import type { AppThunk } from '@/store';
import type { Category, CategoryDetail, MessageResponse } from '@/types';
import {
  addCategoryToList,
  removeCategory,
  resetCategory,
  setCategories,
  setCategoriesLoading,
  setCategory,
  setStoreCategories
} from './slice';

// fetch store categories api
export const fetchStoreCategories =
  (): AppThunk<Promise<void>> => async dispatch => {
    try {
      const response = await axios.get<{ categories: Category[] }>(
        `${API_URL}/category/list`
      );

      dispatch(setStoreCategories(response.data.categories));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// fetch categories api
export const fetchCategories =
  (): AppThunk<Promise<void>> => async dispatch => {
    try {
      dispatch(setCategoriesLoading(true));
      const response = await axios.get<{ categories: Category[] }>(
        `${API_URL}/category`
      );

      dispatch(setCategories(response.data.categories));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setCategoriesLoading(false));
    }
  };

// fetch category api: the populated products become select options
export const fetchCategory =
  (id: string): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      const response = await axios.get<{
        category: Omit<Category, 'products'> & {
          products: Array<{ _id: string; name: string }>;
        };
      }>(`${API_URL}/category/${id}`);

      const category = {
        ...response.data.category,
        products: formatSelectOptions(response.data.category.products)
      } as CategoryDetail;

      dispatch(setCategory(category));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// add category api: goes back to the previous page on success
export const addCategory =
  (values: AddCategoryValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      // `isActive` is sent too (the legacy thunk dropped it although the form had the switch
      // and the API reads it).
      const newCategory = {
        name: values.name,
        description: values.description,
        products: values.products,
        isActive: values.isActive
      };

      const response = await axios.post<
        MessageResponse & { category: Category }
      >(`${API_URL}/category/add`, newCategory);

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(addCategoryToList(response.data.category));
        dispatch(resetCategory());
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// update category api: goes back to the previous page on success
export const updateCategory =
  (id: string, values: EditCategoryValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const newCategory = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        products: values.products
      };

      const response = await axios.put<MessageResponse>(
        `${API_URL}/category/${id}`,
        { category: newCategory }
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(resetCategory());
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// activate category api
export const activateCategory =
  (id: string, value: boolean): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.put<MessageResponse>(
        `${API_URL}/category/${id}/active`,
        {
          category: {
            isActive: value
          }
        }
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// delete category api: goes back to the previous page on success
export const deleteCategory =
  (id: string): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/category/delete/${id}`
      );

      if (response.data.success == true) {
        notify.success(`${response.data.message}`);
        dispatch(removeCategory(id));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
