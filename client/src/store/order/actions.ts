import axios from 'axios';

import { getSessionId } from '@/lib/analytics';
import { API_URL, CART_ID, TOKEN_KEY } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import type { AppThunk } from '@/store';
import { clearCart, getCartId } from '@/store/cart/actions';
import { toggleCart } from '@/store/navigation/slice';
import type {
  CartItemStatus,
  MessageResponse,
  Order,
  PageFilters,
  SearchFilter
} from '@/types';
import {
  clearOrders,
  setOrder,
  setOrderAdvancedFilters,
  setOrderLoading,
  setOrders,
  setSearchedOrders,
  updateOrderStatus
} from './slice';

const ORDERS_PER_PAGE = 20;

interface OrdersResponse extends PageFilters {
  orders: Order[];
}

// Shared by the "all orders" (admin) and "my orders" lists.
const loadOrders =
  (path: string, page: number): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get<OrdersResponse>(`${API_URL}${path}`, {
        params: {
          page: page ?? 1,
          limit: ORDERS_PER_PAGE
        }
      });

      const { orders, totalPages, currentPage, count } = response.data;

      dispatch(setOrders(orders));

      dispatch(setOrderAdvancedFilters({ totalPages, currentPage, count }));
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };

// fetch every order api (admin)
export const fetchOrders = (page = 1) => loadOrders('/order', page);

// fetch the signed in user's orders api
export const fetchAccountOrders = (page = 1) => loadOrders('/order/me', page);

// search orders by id api
export const searchOrders =
  (filter: SearchFilter): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get<{ orders: Order[] }>(
        `${API_URL}/order/search`,
        {
          params: {
            search: filter.value
          }
        }
      );

      dispatch(setSearchedOrders(response.data.orders));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };

// fetch order api
export const fetchOrder =
  (id: string, withLoading = true): AppThunk<Promise<void>> =>
  async dispatch => {
    try {
      if (withLoading) {
        dispatch(setOrderLoading(true));
      }

      const response = await axios.get<{ order: Order }>(
        `${API_URL}/order/${id}`
      );

      dispatch(setOrder(response.data.order));
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      if (withLoading) {
        dispatch(setOrderLoading(false));
      }
    }
  };

// cancel the order being viewed api
export const cancelOrder =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    try {
      const order = getState().order.order;
      if (!order) return;

      await axios.delete(`${API_URL}/order/cancel/${order._id}`);

      navigation.push('/dashboard/orders');
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// update the status of one item of the order being viewed api
export const updateOrderItemStatus =
  (itemId: string, status: CartItemStatus): AppThunk<Promise<void>> =>
  async (dispatch, getState) => {
    try {
      const order = getState().order.order;
      if (!order) return;

      const response = await axios.put<
        MessageResponse & { orderCancelled?: boolean }
      >(`${API_URL}/order/status/item/${itemId}`, {
        orderId: order._id,
        cartId: order.cartId,
        status
      });

      if (response.data.orderCancelled) {
        navigation.push('/dashboard/orders');
      } else {
        dispatch(updateOrderStatus({ itemId, status }));
        dispatch(fetchOrder(order._id, false));
      }

      notify.success(`${response.data.message}`);
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// create the order of the current cart api: goes to the success page and empties the cart
export const addOrder =
  (): AppThunk<Promise<void>> => async (dispatch, getState) => {
    try {
      const cartId = window.localStorage.getItem(CART_ID);
      const total = getState().cart.cartTotal;

      if (cartId) {
        const response = await axios.post<{ order: { _id: string } }>(
          `${API_URL}/order/add`,
          {
            cartId,
            total
          },
          // Anonymous analytics session (random per tab), so the order joins the browsing session
          { headers: { 'X-Analytics-Session': getSessionId() } }
        );

        navigation.push(`/order/success/${response.data.order._id}`);
        dispatch(clearCart());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };

// "Place Order" of the cart drawer: creates the cart id, then the order, and closes the drawer
export const placeOrder = (): AppThunk => (dispatch, getState) => {
  const token = window.localStorage.getItem(TOKEN_KEY);

  const cartItems = getState().cart.cartItems;

  if (token && cartItems.length > 0) {
    Promise.all([dispatch(getCartId())]).then(() => {
      dispatch(addOrder());
    });
  }

  dispatch(toggleCart());
};
