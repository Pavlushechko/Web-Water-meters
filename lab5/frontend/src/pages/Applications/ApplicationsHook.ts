// hooks/useApplications.ts
import { useEffect, useState } from 'react';
import { Hook } from "../../Hook"; // Импортируем основной хук

export type Application = {
  id: number | string;
  status: string;
  created_at: string | Date;
  completion_date?: string | Date | null;
};

export function useApplications() {
  const { getAccessToken } = Hook(); // Получаем метод для работы с токеном
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {

        const token = await getAccessToken();
        if (!token) throw new Error("Требуется авторизация");
        const response = await fetch('http://localhost:8000/api/applications/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) throw new Error('Ошибка при загрузке заявок');

        const data = await response.json();
        console.log('Заявки получены:', data);
        setApplications(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    error
  };
}
