// hooks/useApplications.ts
import { useEffect, useState, useCallback } from 'react';
import axiosClient from '../../Clients';
import { isAxiosError } from 'axios';

export interface ApplicationFilters {
  createdStart?: string;
  createdEnd?: string;
  completedStart?: string;
  completedEnd?: string;
  status?: string;
}

export interface Application {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
  completion_date?: string;
  [key: string]: any; // если могут быть другие поля
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

  const handleDateChange = useCallback((field: keyof ApplicationFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value ? formatDateForAPI(value) : undefined
    }));
  }, []);


  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (filters.createdStart) params.append('created_start', filters.createdStart);
        if (filters.createdEnd) params.append('created_end', filters.createdEnd);
        if (filters.completedStart) params.append('completed_start', filters.completedStart);
        if (filters.completedEnd) params.append('completed_end', filters.completedEnd);
        if (filters.status) params.append('status', filters.status); // <-- добавлено

        const response = await axiosClient.get('/api/applications/', { params });

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