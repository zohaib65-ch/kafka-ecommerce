import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import type {
  AccountPasswordValues,
  ResetPasswordValues
} from '@/lib/validations/auth';
import type { AppThunk } from '@/store';
import { signOut } from '@/store/login/actions';
import type { MessageResponse } from '@/types';

// reset password with the emailed token api
export const resetPassword =
  (token: string, values: ResetPasswordValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/auth/reset/${token}`,
        values
      );

      if (response.data.success == true) {
        navigation.push('/login');
      }

      notify.success(`${response.data.message}`);
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try to reset again!');
      return false;
    }
  };

// change the password of the signed in user api: signs the user out on success.
// `values.password` is the current password and `values.confirmPassword` the new one.
export const resetAccountPassword =
  (values: AccountPasswordValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/auth/reset`,
        values
      );

      if (response.data.success === true) {
        dispatch(signOut());
      }

      notify.success(`${response.data.message}`);
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try to reset again!');
      return false;
    }
  };
