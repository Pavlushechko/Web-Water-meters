// hooks/useApplications.ts
import { useEffect, useState } from 'react';
import axiosClient from '../../Clients'; 
import { isAxiosError } from 'axios';

export type Application = {
  id: number | string;
  status: string;
  created_at: string | Date;
  completion_date?: string | Date | null;
};

export const statusMapping: { [key: string]: string } = {
  "Черновик": "draft",
  "Удалён": "deleted",
  "Сформирован": "formatted",
  "Завершён": "completed",
  "Отклонён": "rejected"
};


export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Функция для преобразования английского статуса в русский
  const getRussianStatus = (englishStatus: string) => {
    return Object.entries(statusMapping).find(
      ([russian, english]) => english === englishStatus
    )?.[0] || englishStatus; // Если не найдено, возвращаем как есть
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosClient.get('/api/applications/');
        
        // Преобразуем статусы в русские названия
        const dataWithTranslatedStatuses = response.data.map((app: Application) => ({
          ...app,
          status: getRussianStatus(app.status) // Преобразуем здесь
        }));

        console.log('Заявки получены:', dataWithTranslatedStatuses);
        setApplications(dataWithTranslatedStatuses);
      } catch (err) {
        if (isAxiosError(err)) {
          const errorMessage = err.response?.data?.detail || 
                            err.response?.data?.message || 
                            'Ошибка при загрузке заявок';
          setError(errorMessage);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Неизвестная ошибка');
        }
        console.error('Ошибка загрузки заявок:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Экспортируем функцию преобразования статусов для использования в других компонентах
  return {
    applications,
    loading,
    error,
    statusMapping
  };
}