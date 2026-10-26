import axios from 'axios';

import { API_URL, ROLES } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import { formatSelectOptions } from '@/lib/select';
import {
  NO_BRAND_VALUE,
  type AddProductValues,
  type EditProductValues
} from '@/lib/validations/product';
import type { AppThunk } from '@/store';
import type {
  BrandRef,
  ManagedProduct,
  MessageResponse,
  ProductDetail,
  StoreListProduct,
  StoreProduct
} from '@/types';
import {
  getSortOrder,
  productsFilterOrganizer,
  toAdvancedFilters,
  type FilterValue
} from './filters';
import {
  addProductToList,
  removeProduct,
  setAdvancedFilters,
  setProduct,
  setProductLoading,
  setProducts,
  setProductsSelect,
  setStoreProduct,
  setStoreProducts
} from './slice';

export { resetAdvancedFilters, setAdvancedFilters } from './slice';

/**
 * Fetches (filters / sorts / paginates) the store products api.
 *   filterProducts('category', slug) | ('brand', slug) | ('sorting', index) |
 *   ('price', [min, max]) | ('rating', n) | ('pagination', page)
 * Without arguments it loads the unfiltered first page (the /shop landing page).
 */
export const filterProducts =
  (n?: string, v?: FilterValue): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    try {
      dispatch(setProductLoading(true));
      const advancedFilters = getState().product.advancedFilters;
      const payload = productsFilterOrganizer(n, v, advancedFilters);

      // `page` is request-only: the store tracks the page the server answers with.
      dispatch(setAdvancedFilters(toAdvancedFilters(payload)));
      const sortOrder = getSortOrder(payload.order);
      const response = await axios.get<{
        products: StoreListProduct[];
        totalPages: number;
        currentPage: number;
        count: number;
      }>(`${API_URL}/product/list`, {
        // The API does JSON.parse(sortOrder): axios 1.x would otherwise serialize the object
        // as `sortOrder[_id]=-1`.
        params: { ...payload, sortOrder: JSON.stringify(sortOrder) }
      });
      const { products, totalPages, currentPage, count } = response.data;

      dispatch(setStoreProducts(products));

      dispatch(setAdvancedFilters({ totalPages, currentPage, count }));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };

// fetch store product api (product page)
export const fetchStoreProduct =
  (slug: string): AppThunk<Promise<void>> =>
  async dispatch => {
    dispatch(setProductLoading(true));

    try {
      const response = await axios.get<{
        product: Omit<StoreProduct, 'inventory'>;
      }>(`${API_URL}/product/item/${slug}`);

      const inventory = response.data.product.quantity;
      const product: StoreProduct = { ...response.data.product, inventory };

      dispatch(setStoreProduct(product));
    } catch (error) {
      // A missing product leaves nothing to show: do not keep the previous one around.
      dispatch(setStoreProduct(null));
      handleError(error, dispatch);
    } finally {
      dispatch(setProductLoading(false));
    }
  };

export const fetchProductsSelect =
  (): AppThunk<Promise<void>> => async dispatch => {
    try {
      const response = await axios.get<{
        products: Array<{ _id: string; name: string }>;
      }>(`${API_URL}/product/list/select`);

      const formattedProducts = formatSelectOptions(response.data.products);

      dispatch(setProductsSelect(formattedProducts));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// fetch products api (dashboard list)
export const fetchProducts = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    dispatch(setProductLoading(true));

    const response = await axios.get<{ products: ManagedProduct[] }>(
      `${API_URL}/product`
    );

    dispatch(setProducts(response.data.products));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setProductLoading(false));
  }
};

// fetch product api (dashboard edit page): the brand becomes a select option
export const fetchProduct =
  (id: string): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      const response = await axios.get<{
        product: Omit<ProductDetail, 'brand' | 'inventory'> & {
          brand?: BrandRef & { _id: string };
        };
      }>(`${API_URL}/product/${id}`);

      const inventory = response.data.product.quantity;

      const brand = response.data.product.brand;
      const brandData = formatSelectOptions(
        brand ? [{ _id: brand._id, name: brand.name }] : null,
        !brand
      );

      const product: ProductDetail = {
        ...response.data.product,
        brand: brandData[0],
        inventory
      };

      dispatch(setProduct(product));
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// add product api (multipart, with the image): goes back to the previous page on success
export const addProduct =
  (values: AddProductValues): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    try {
      const user = getState().account.user;
      const brands = getState().brand.brandsSelect;

      // Merchants can only add products to their own brand (`brandsSelect[0]` is the empty option).
      const brand =
        user.role === ROLES.Merchant
          ? (brands[1]?.value ?? values.brand)
          : values.brand;

      const newProduct = {
        sku: values.sku,
        name: values.name,
        description: values.description,
        price: values.price,
        quantity: values.quantity,
        image: values.image,
        isActive: values.isActive,
        taxable: Number(values.taxable),
        brand: String(brand) === NO_BRAND_VALUE ? null : String(brand)
      };

      const formData = new FormData();
      for (const [key, value] of Object.entries(newProduct)) {
        if (key === 'brand' && value === null) continue;
        formData.set(key, value instanceof File ? value : String(value));
      }

      const response = await axios.post<
        MessageResponse & { product: ManagedProduct }
      >(`${API_URL}/product/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(addProductToList(response.data.product));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// update product api
export const updateProduct =
  (id: string, values: EditProductValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const newProduct = {
        name: values.name,
        sku: values.sku,
        slug: values.slug,
        description: values.description,
        quantity: Number(values.quantity),
        price: Number(values.price),
        taxable: values.taxable === '1',
        brand:
          values.brand && values.brand !== NO_BRAND_VALUE ? values.brand : null
      };

      const response = await axios.put<MessageResponse>(
        `${API_URL}/product/${id}`,
        { product: newProduct }
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

// activate product api
export const activateProduct =
  (id: string, value: boolean): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.put<MessageResponse>(
        `${API_URL}/product/${id}/active`,
        {
          product: {
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

// delete product api: goes back to the previous page on success
export const deleteProduct =
  (id: string): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.delete<MessageResponse>(
        `${API_URL}/product/delete/${id}`
      );

      if (response.data.success === true) {
        notify.success(`${response.data.message}`);
        dispatch(removeProduct(id));
        navigation.back();
        return true;
      }
      return false;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
