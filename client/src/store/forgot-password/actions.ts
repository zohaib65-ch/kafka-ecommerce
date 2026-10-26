import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import navigation from '@/lib/navigation';
import notify from '@/lib/notify';
import type { ForgotPasswordValues } from '@/lib/validations/auth';
import type { AppThunk } from '@/store';
import type { MessageResponse } from '@/types';

// request a password reset email api (legacy name: forgotPassowrd)
export const forgotPassword =
  (values: ForgotPasswordValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/auth/forgot`,
        values
      );

      if (response.data.success === true) {
        navigation.push('/login');
      }
      notify.success(`${response.data.message}`);
      return true;
    } catch (error) {
      handleError(error, dispatch, 'Please try again!');
      return false;
    }
  };
