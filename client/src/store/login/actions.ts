import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import navigation from '@/lib/navigation';
import { clearStoredToken, storeToken } from '@/lib/token';
import type { LoginValues } from '@/lib/validations/auth';
import type { AppThunk } from '@/store';
import { clearAccount } from '@/store/account/slice';
import { clearAuth, setAuth } from '@/store/authentication/slice';

interface LoginResponse {
  success: boolean;
  token: string;
  user: { id: string; firstName?: string; lastName?: string; email: string };
}

// Stores the token and flips `authentication.authenticated`; pages redirect on that change.
export const login =
  (values: LoginValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        values
      );

      const firstName = response.data.user.firstName;

      storeToken(response.data.token);

      dispatch(setAuth());
      notify.success(`Hey${firstName ? ` ${firstName}` : ''}, Welcome Back!`);
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try to login again!');
      return false;
    }
  };

export const signOut = (): AppThunk => dispatch => {
  dispatch(clearAuth());
  dispatch(clearAccount());
  navigation.push('/login');

  clearStoredToken();

  notify.success('You have signed out!');
  // dispatch(clearCart()); (the legacy store kept the cart after signing out)
};
