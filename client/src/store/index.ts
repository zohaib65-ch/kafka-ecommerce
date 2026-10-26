import {
  combineReducers,
  configureStore,
  type ThunkAction,
  type UnknownAction
} from '@reduxjs/toolkit';

import account from './account/slice';
import address from './address/slice';
import authentication from './authentication/slice';
import brand from './brand/slice';
import cart from './cart/slice';
import category from './category/slice';
import merchant from './merchant/slice';
import navigation from './navigation/slice';
import order from './order/slice';
import product from './product/slice';
import review from './review/slice';
import users from './users/slice';
import wishlist from './wishlist/slice';

export const rootReducer = combineReducers({
  authentication,
  account,
  address,
  brand,
  cart,
  category,
  merchant,
  navigation,
  order,
  product,
  review,
  users,
  wishlist
});

/**
 * Creates a store. Always call this per render tree (see `StoreProvider`): a module level
 * singleton would be shared between requests when rendering on the server.
 */
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<R = void> = ThunkAction<
  R,
  RootState,
  unknown,
  UnknownAction
>;
