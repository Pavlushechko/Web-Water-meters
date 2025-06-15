import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Состояние пользователя
interface UserState {
  isLoggedIn: boolean; // Флаг авторизации
  username: string;    // Имя пользователя
}

// Начальное состояние
const initialState: UserState = {
  isLoggedIn: false,
  username: '',
};

// Создание slice для пользователя
const userSlice = createSlice({
  name: 'user', // Имя slice
  initialState, // Начальное состояние
  reducers: {
    // Действие входа
    login_slice: (state, action: PayloadAction<{ username: string }>) => {
      state.isLoggedIn = true;
      state.username = action.payload.username;
    },
    // Действие выхода
    logout_slice: (state) => {
      state.isLoggedIn = false;
      state.username = '';
    },
  },
});

// Экспорт действий и редюсера
export const { login_slice, logout_slice } = userSlice.actions;
export default userSlice.reducer;