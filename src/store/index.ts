// src/store/index.ts
import { configureStore, createAction, createReducer, PayloadAction } from '@reduxjs/toolkit';

// Initial state
interface AppState {
    isLoggedIn: boolean;
    isRegistered: boolean;
    isLoggedOut: boolean;
  }
  
  const initialState: AppState = {
    isLoggedIn: false,
    isRegistered: false,
    isLoggedOut: false,
  };
  
// Define actions
const loginAction = createAction('LOGIN');
const registerAction = createAction('REGISTER');
const logoutAction = createAction('LOGOUT');

// Create reducer
const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginAction, (state) => {
      state.isLoggedIn = true;
    })
    .addCase(registerAction, (state) => {
      state.isRegistered = true;
    })
    .addCase(logoutAction, (state) => {
        state.isLoggedOut = true
    })
});

// Create Redux store
const store = configureStore({
  reducer: rootReducer,
});

export type { AppState };
export {loginAction, registerAction, logoutAction}

export default store;

