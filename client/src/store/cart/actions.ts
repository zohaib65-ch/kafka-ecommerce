import axios from 'axios';

import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics';
import { API_URL, CART_ID, CART_ITEMS, CART_TOTAL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import { createQuantitySchema, firstIssueMessage } from '@/lib/validations';
import type { AppThunk } from '@/store';
import { toggleCart } from '@/store/navigation/slice';
import type { CartItem, StoreProduct } from '@/types';
import {
  addItem,
  cartIdSet,
  hydrateCart,
  removeItem,
  resetCart,
  setTotal
} from './slice';

const readStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode): the cart then only lives in memory.
  }
};

const removeStorage = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

/** The cart persisted in localStorage, or `null` when there is none (or it is unreadable). */
export const readStoredCartItems = (): CartItem[] | null => {
  const raw = readStorage(CART_ITEMS);
  if (!raw) return null;

  try {
    const items: unknown = JSON.parse(raw);
    return Array.isArray(items) ? (items as CartItem[]) : null;
  } catch {
    return null;
  }
};

// Handle Add To Cart: `quantity` comes from the (validated) quantity form of the product page.
// Returns false (and shows the problem) when the quantity is not allowed for the stock.
export const handleAddToCart =
  (product: StoreProduct, quantity: number | string): AppThunk<boolean> =>
  (dispatch, getState) => {
    const result = createQuantitySchema(product.inventory).safeParse({
      quantity: String(quantity)
    });

    if (!result.success) {
      notify.error(firstIssueMessage(result.error));
      return false;
    }

    const purchaseQuantity = Number(quantity);
    const cartItem: CartItem = {
      ...product,
      quantity: purchaseQuantity,
      totalPrice: parseFloat((purchaseQuantity * product.price).toFixed(2))
    };

    dispatch(addItem(cartItem));

    writeStorage(CART_ITEMS, JSON.stringify(getState().cart.cartItems));

    trackAddToCart(cartItem);

    dispatch(calculateCartTotal());
    dispatch(toggleCart());
    return true;
  };

// Handle Remove From Cart
export const handleRemoveFromCart =
  (product: { _id: string; slug?: string }): AppThunk =>
  (dispatch, getState) => {
    dispatch(removeItem(product._id));

    writeStorage(CART_ITEMS, JSON.stringify(getState().cart.cartItems));

    trackRemoveFromCart(product);
    dispatch(calculateCartTotal());
    // dispatch(toggleCart());
  };

export const calculateCartTotal = (): AppThunk => (dispatch, getState) => {
  const cartItems = getState().cart.cartItems;

  let total = 0;

  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });

  total = parseFloat(total.toFixed(2));
  writeStorage(CART_TOTAL, String(total));
  dispatch(setTotal(total));
};

// set cart store from local storage
export const handleCart = (): AppThunk => dispatch => {
  const cartItems = readStoredCartItems();

  if (cartItems) {
    dispatch(
      hydrateCart({
        cartItems,
        cartTotal: Number(readStorage(CART_TOTAL)) || 0,
        cartId: readStorage(CART_ID) ?? ''
      })
    );
    dispatch(calculateCartTotal());
  }
};

export const handleCheckout = (): AppThunk => dispatch => {
  dispatch(toggleCart());
  navigation.push('/login');
  notify.success('Please Login to proceed to checkout');
};

// Continue shopping use case
export const handleShopping = (): AppThunk => dispatch => {
  navigation.push('/shop');
  dispatch(toggleCart());
};

export const setCartId =
  (cartId: string): AppThunk =>
  dispatch => {
    writeStorage(CART_ID, cartId);
    dispatch(cartIdSet(cartId));
  };

// create cart id api: the server side cart is created once per checkout
export const getCartId =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    try {
      const cartId = readStorage(CART_ID);
      const cartItems = getState().cart.cartItems;
      const products = getCartItems(cartItems);

      // create cart id if there is no one
      if (!cartId) {
        const response = await axios.post<{ cartId: string }>(
          `${API_URL}/cart/add`,
          { products }
        );

        dispatch(setCartId(response.data.cartId));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };

export const clearCart = (): AppThunk => dispatch => {
  removeStorage(CART_ITEMS);
  removeStorage(CART_TOTAL);
  removeStorage(CART_ID);

  dispatch(resetCart());
};

const getCartItems = (cartItems: CartItem[]) =>
  cartItems.map(item => ({
    quantity: item.quantity,
    price: item.price,
    taxable: item.taxable,
    product: item._id
  }));
