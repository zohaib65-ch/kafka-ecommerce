import axios from 'axios';

import { API_URL } from '@/lib/constants';
import handleError from '@/lib/error';
import notify from '@/lib/notify';
import type { ProfileValues } from '@/lib/validations/account';
import type { AppThunk } from '@/store';
import type { MessageResponse, User } from '@/types';
import { setProfile, setProfileLoading } from './slice';

// fetch the signed in user's profile api
export const fetchProfile = (): AppThunk<Promise<void>> => async dispatch => {
  try {
    dispatch(setProfileLoading(true));
    const response = await axios.get<{ user: User }>(`${API_URL}/user/me`);

    dispatch(setProfile(response.data.user));
  } catch (error) {
    handleError(error, dispatch);
  } finally {
    dispatch(setProfileLoading(false));
  }
};

// update profile api
export const updateProfile =
  (values: ProfileValues): AppThunk<Promise<boolean>> =>
  async dispatch => {
    try {
      // Only the editable fields are sent (the legacy form posted the whole user document).
      const response = await axios.put<MessageResponse & { user: User }>(
        `${API_URL}/user`,
        { profile: values }
      );

      // Merge just the edited fields: the response is not populated (no merchant / brand) and
      // must not replace what `fetchProfile` loaded.
      const { firstName, lastName, phoneNumber } = response.data.user;
      dispatch(setProfile({ firstName, lastName, phoneNumber }));

      notify.success(`${response.data.message}`);
      return true;
    } catch (error) {
      handleError(error, dispatch);
      return false;
    }
  };
