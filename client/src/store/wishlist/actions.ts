import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import type { AppThunk } from '@/store';
import { setProductLiked } from '@/store/product/slice';
import type { MessageResponse, WishlistItem } from '@/types';
import { setWishlist, setWishlistLoading } from './slice';

// like / unlike a product api (requires a signed in user)
export const updateWishlist =
  (isLiked: boolean, productId: string): AppThunk<Promise<boolean>> =>
  async (dispatch, getState) => {
    try {
      if (getState().authentication.authenticated === true) {
        const response = await axios.post<MessageResponse>(
          `${API_URL}/wishlist`,
          {
            isLiked,
            product: productId
          }
        );

        if (response.data.success === true) {
          notify.success(`${response.data.message}`);
          // Keep shop lists and the product page in sync without refetching them.
          dispatch(setProductLiked({ id: productId, isLiked }));
          dispatch(fetchWishlist());
          return true;
        }
        return false;
      } else {
        notify.warning('Please login to wishlist a product');
        return false;
      }
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };

// fetch wishlist api
export const fetchWishlist = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    dispatch(setWishlistLoading(true));

    const response = await axios.get<{ wishlist: WishlistItem[] }>(
      `${API_URL}/wishlist`
    );

    dispatch(setWishlist(response.data.wishlist));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setWishlistLoading(false));
  }
};
