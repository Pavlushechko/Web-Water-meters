import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Service } from './ServiceDetail';
import { Hook } from '../../Hook';

export function ServiceDetailHook(gvs: string, hvs: string) {
  const { getAccessToken } = Hook();
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = await getAccessToken();
        if (!token) throw new Error("Требуется авторизация");

        const response = await fetch(`http://localhost:8000/api/services/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Ошибка загрузки услуги с id=${id}`);
        const data = await response.json();
        setService(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = await getAccessToken();
      if (!token) throw new Error("Не авторизован");

      const applicationResponse = await fetch('http://localhost:8000/api/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!applicationResponse.ok) {
        throw new Error('Ошибка при создании заявки');
      }

      const applicationData = await applicationResponse.json();
      const applicationId = applicationData.id;

      const appServiceResponse = await fetch('http://localhost:8000/api/application-services/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          application: applicationId,
          service_id: service?.id,
          gvs: parseInt(gvs),
          hvs: parseInt(hvs),
        }),
      });

      if (!appServiceResponse.ok) {
        throw new Error('Ошибка при добавлении ApplicationService');
      }

      setSubmitted(true);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return { service, loading, error, handleSubmit, submitted };
}
