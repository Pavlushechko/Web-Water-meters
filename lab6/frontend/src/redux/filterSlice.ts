import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Определение типов фильтров
interface ServiceFilter {
  name: string; // Фильтр по названию услуги
}

interface ApplicationFilter {
  status: string;     // Статус заявки
  start_date: string | null; // Дата начала периода
  end_date: string | null;   // Дата конца периода
}

// Состояние фильтров
interface FilterState {
  serviceFilter: ServiceFilter;
  applicationFilter: ApplicationFilter;
}

// Начальное состояние
const initialState: FilterState = {
  serviceFilter: {
    name: '', // Пустой фильтр по умолчанию
  },
  applicationFilter: {
    status: '',       // Пустой статус
    start_date: null, // Нет даты начала
    end_date: null,   // Нет даты конца
  },
};

// Создание slice (части хранилища) для фильтров
const filtersSlice = createSlice({
  name: 'filters', // Имя slice
  initialState,    // Начальное состояние
  reducers: {
    // Обновление фильтров услуг
    setServiceFilter: (state, action: PayloadAction<ServiceFilter>) => {
      state.serviceFilter = action.payload;
    },
    // Обновление фильтров заявок
    setApplicationFilter: (state, action: PayloadAction<ApplicationFilter>) => {
      state.applicationFilter = action.payload;
    },
  },
});

// Экспорт действий и редюсера
export const { setServiceFilter, setApplicationFilter } = filtersSlice.actions;
export default filtersSlice.reducer;