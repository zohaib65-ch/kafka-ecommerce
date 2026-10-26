import axios from 'axios';

import { TOKEN_KEY } from '@/lib/constants';

// Sets (or clears) the Authorization header sent with every API request.
const setToken = (token?: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getStoredToken = (): string | null => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const storeToken = (token: string) => {
  setToken(token);
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage can be unavailable (private mode); the session just won't persist.
  }
};

export const clearStoredToken = () => {
  setToken(null);
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};

export default setToken;
