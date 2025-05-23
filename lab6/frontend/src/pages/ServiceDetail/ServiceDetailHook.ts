import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Service } from './ServiceDetail';
import axiosClient from '../../Clients';

export function ServiceDetailHook(gvs: string, hvs: string) {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get(`/api/services/${id}/`);
        setService(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
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
      setSubmitted(false);
      // 1. Создаем заявку
      const applicationResponse = await axiosClient.post('/api/applications/', {});
      const applicationId = applicationResponse.data.id;

      // 2. Добавляем услугу к заявке
      await axiosClient.post('/api/application-services/', {
        application: applicationId,
        service_id: service?.id,
        gvs: parseInt(gvs),
        hvs: parseInt(hvs),
      });

      setSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при отправке';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return { service, loading, error, handleSubmit, submitted };
}
