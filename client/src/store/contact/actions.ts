import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import type { ContactValues } from '@/lib/validations/contact';
import type { AppThunk } from '@/store';
import type { MessageResponse } from '@/types';

// contact us api
export const contactUs =
  (values: ContactValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      const response = await axios.post<MessageResponse>(
        `${API_URL}/contact/add`,
        values
      );

      notify.success(`${response.data.message}`);
      return true;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
