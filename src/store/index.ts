import { configureStore, createAction, createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../components/Home';

interface AppState {
  isRegistered: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  selectedBoard: Board | null;
  boards: Board[] | null;
  updateBoardNameInStore: Board | null;
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  color: string;
}

const initialState: AppState = {
  isRegistered: false,
  isLoggedIn: false,
  currentUser: null,
  selectedBoard: null,
  boards: null,
  updateBoardNameInStore: null
};

// Define actions
const loginAction = createAction<User>('LOGIN');
const registerAction = createAction('REGISTER');
const logoutAction = createAction('LOGOUT');
const setSelectedBoardRedux = createAction<Board | null>('SET_SELECTED_BOARD'); // Define action for setting selected board
const setBoards = createAction<Board[] | null>('SET_BOARDS');
const updateBoardNameInStore = createAction<Board>('UPDATE_BOARD_NAME');
const setCurrentUser = createAction<User | null>('SET_CURRENT_USER');

// Define reducer
const rootReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(loginAction, (state, action) => {
      state.isLoggedIn = true;
      state.isRegistered = false;
      state.currentUser = action.payload;
    })
    .addCase(registerAction, (state) => {
      state.isRegistered = true;
    })
    .addCase(logoutAction, (state) => {
      state.isLoggedIn = false;
      state.isRegistered = false;
      state.currentUser = null;
    })
    .addCase(setSelectedBoardRedux, (state, action) => {
      state.selectedBoard = action.payload;
    })
    .addCase(setBoards, (state, action) => {
      state.boards = action.payload;
    })
    .addCase(setCurrentUser, (state, action) => {
      state.currentUser = action.payload;
    })
});

// Create Redux store
const store = configureStore({
  reducer: rootReducer,
});

export type { AppState };
export { loginAction, registerAction, logoutAction, setSelectedBoardRedux, setBoards, updateBoardNameInStore, setCurrentUser }; // Export actions

export default store;
