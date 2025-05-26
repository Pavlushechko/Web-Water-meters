// hooks/useApplications.ts
import { useEffect, useState, useCallback } from 'react';
import axiosClient from '../../Clients';
import { isAxiosError } from 'axios';

export interface Application {
  id: number | string;
  status: string;
  created_at: string;
  completion_date?: string | null;
}

export interface ApplicationFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const statusMapping: Record<string, string> = {
  "Черновик": "draft",
  "Удалён": "deleted",
  "Сформирован": "formatted",
  "Завершён": "completed",
  "Отклонён": "rejected"
};

// Создаем обратное отображение для перевода с английского на русский
const reverseStatusMapping = Object.fromEntries(
  Object.entries(statusMapping).map(([russian, english]) => [english, russian])
);

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ApplicationFilters>({});

  // Оптимизированная версия функции перевода статуса
  const getRussianStatus = useCallback((englishStatus: string) => {
    return reverseStatusMapping[englishStatus] || englishStatus;
  }, []);

  const formatDateForAPI = (dateString: string): string => {
    return dateString;
  };

  const handleStatusChange = useCallback((value: string) => {
    setFilters(prev => ({
      ...prev,
      status: value || undefined
    }));
  }, []);

  const handleDateChange = useCallback((type: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value ? formatDateForAPI(value) : undefined
    }));
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('start_date', filters.startDate);
        if (filters.endDate) params.append('end_date', filters.endDate);

        const response = await axiosClient.get('/api/applications/', { params });
        
        // Используем getRussianStatus для перевода статусов
        const dataWithTranslatedStatuses = response.data.map((app: Application) => ({
          ...app,
          status: getRussianStatus(app.status)
        }));

        setApplications(dataWithTranslatedStatuses);
      } catch (err) {
        if (isAxiosError(err)) {
          const errorMessage = err.response?.data?.detail || 
                            err.response?.data?.message || 
                            'Ошибка при загрузке заявок';
          setError(errorMessage);
        } else {
          setError('Неизвестная ошибка');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [filters, getRussianStatus]);

  return {
    applications,
    loading,
    error,
    statusMapping,
    filters,
    handleStatusChange,
    handleDateChange,
    getRussianStatus // Экспортируем функцию, если она нужна в компоненте
  };
}