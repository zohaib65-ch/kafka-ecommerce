import { createSlice } from '@reduxjs/toolkit';

export interface AuthenticationState {
  authenticated: boolean;
  /** True once the stored token has been read (it lives in localStorage, so only on the client). */
  initialized: boolean;
}

const initialState: AuthenticationState = {
  authenticated: false,
  initialized: false
};

const authenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    setAuth(state) {
      state.authenticated = true;
    },
    clearAuth(state) {
      state.authenticated = false;
    },
    setAuthInitialized(state) {
      state.initialized = true;
    }
  }
});

export const { setAuth, clearAuth, setAuthInitialized } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
