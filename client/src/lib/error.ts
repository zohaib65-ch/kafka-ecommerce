/**
 * Generic API error handler: receives the error an axios call threw and tells the user about it.
 */

import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

import notify from '@/lib/notify';
import type { RootState } from '@/store';
import { signOut } from '@/store/login/actions';

type ErrorBody = { error?: string; message?: string };

const GENERIC_MESSAGE =
  'Your request could not be processed. Please try again.';

// An empty title would render a blank toast heading: fall back to the message as the title.
const showError = (title: string, message: string) => {
  if (title) notify.error(title, { message });
  else notify.error(message);
};

// Both the store's dispatch and the one a thunk receives satisfy this.
type ErrorDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;

const handleError = (err: unknown, dispatch: ErrorDispatch, title = '') => {
  if (isAxiosError<ErrorBody>(err) && err.response) {
    const { status, data } = err.response;

    if (status === 400) {
      showError(title || 'Please Try Again!', data?.error ?? GENERIC_MESSAGE);
    } else if (status === 404) {
      // Not found is handled by the pages themselves ("No product found." ...).
    } else if (status === 401) {
      dispatch(signOut());
      showError(title, 'Unauthorized Access! Please login again');
    } else if (status === 403) {
      showError(
        title,
        'Forbidden! You are not allowed to access this resource.'
      );
    } else if (status >= 500) {
      showError(title, GENERIC_MESSAGE);
    }
  } else if (err instanceof Error && err.message) {
    showError(title, err.message);
  } else {
    showError(title, GENERIC_MESSAGE);
  }
};

export default handleError;
