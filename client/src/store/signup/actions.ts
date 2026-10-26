import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import { storeToken } from '@/lib/token';
import type { SignupValues } from '@/lib/validations/auth';
import type { AppThunk } from '@/store';
import { setAuth } from '@/store/authentication/slice';

// register api: signs the new user in (token stored, `authentication.authenticated` set)
export const signUp =
  (values: SignupValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<{ token: string }>(
        `${API_URL}/auth/register`,
        values
      );

      storeToken(response.data.token);

      dispatch(setAuth());
      notify.success(
        'You have signed up successfully! You will be receiving an email as well. Thank you!'
      );
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try to signup again!');
      return false;
    }
  };
