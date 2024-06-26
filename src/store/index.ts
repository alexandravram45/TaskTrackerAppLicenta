import { configureStore, createAction, createReducer, PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../components/Home';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AppState {
  isRegistered: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  selectedBoard: Board | null;
  boards: Board[] | null;
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
};


const loginAction = createAction<User>('LOGIN');
const registerAction = createAction('REGISTER');
const logoutAction = createAction('LOGOUT');
const setSelectedBoardRedux = createAction<Board | null>('SET_SELECTED_BOARD'); 
const setBoards = createAction<Board[] | null>('SET_BOARDS');
const setCurrentUser = createAction<User | null>('SET_CURRENT_USER');

export const fetchBoard = createAsyncThunk('board/fetchBoard', async (boardId: string) => {
  const response = await axios.get(`/board/${boardId}`);
  return response.data;
});

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

const store = configureStore({
  reducer: rootReducer,
});

export type { AppState };
export { loginAction, registerAction, logoutAction, setSelectedBoardRedux, setBoards, setCurrentUser }; 

export default store;
