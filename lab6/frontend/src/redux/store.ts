import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Использует localStorage
import userReducer from './userSlice';
import filtersReducer from './filterSlice';

// Настройка сохранения состояния пользователя
const persistConfig = {
  key: 'user', // Ключ для localStorage
  storage,     // Используемое хранилище
};

// Обернутый редюсер с сохранением состояния
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Создание хранилища Redux
export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Редюсер пользователя с сохранением
    filters: filtersReducer,    // Редюсер фильтров
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключает проверку для redux-persist
    }),
});

// Объект для сохранения/восстановления состояния
export const persistor = persistStore(store);

// Типы для TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;