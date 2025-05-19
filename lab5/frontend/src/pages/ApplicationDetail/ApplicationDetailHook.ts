import { useEffect, useState } from 'react';
import { Hook } from '../../Hook';

export function useApplicationDetail(id?: string) {
  const { getAccessToken } = Hook();
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchApplication = async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Требуется авторизация");

        const response = await fetch(`/api/applications/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Ошибка ${response.status}`);
        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  return { application, loading, error };
}
