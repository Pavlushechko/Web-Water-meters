import { useEffect, useState } from 'react';
import axiosClient from '../../Clients'; // Импорт axios-клиента
import { isAxiosError } from 'axios';
import { useApplications } from '../Applications/ApplicationsHook';

interface ApplicationDetail {
  id: string;
  status: string;
  created_at: string;
  form_date?: string | null;
  completion_date?: string | null;
}

export function useApplicationDetail(id?: string) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { statusMapping } = useApplications();
  const [editedApplication, setEditedApplication] = useState<{
    status: string;
    form_date?: string | null;
    completion_date?: string | null;
  }>({
    status: application?.status || '',
    form_date: application?.form_date || '',
    completion_date: application?.completion_date || '',
  });


  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/api/applications/${id}/`);
        setApplication(response.data);
        setEditedApplication(response.data); // копия для редактирования
        setError(null);
      } catch (e) {
        setError(isAxiosError(e) ? e.message : 'Ошибка запроса');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApp();
  }, [id]);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axiosClient.get('/api/check-admin/');
        setIsAdmin(response.data.is_admin);
      } catch {
        setIsAdmin(false);
      }
    };

    checkAdmin();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setEditedApplication(prev => ({
      ...prev,
      [name]: value
    }));
    setApplication(prev => prev ? ({ ...prev, [name]: value }) : prev);
  };


  const handleSave = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error("Access token is missing");

      const payloadToken = JSON.parse(atob(token.split('.')[1]));
      const userId = payloadToken.user_id;
      if (!userId) throw new Error("User ID not found in token");

      const payload = {
        ...editedApplication,
        completion_date:
          editedApplication.completion_date?.trim()
            ? new Date(editedApplication.completion_date).toISOString()
            : null,
        form_date:
          editedApplication.form_date?.trim()
            ? new Date(editedApplication.form_date).toISOString()
            : undefined,
      };

      const response = await axiosClient.put(`/api/applications/${application?.id}/`, payload);
      setApplication(response.data);
      setEditedApplication(response.data);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error while saving:', error);
      setError(error instanceof Error ? error.message : 'Неизвестная ошибка');
    }
  };

  return {
    application,
    editedApplication,
    loading,
    error,
    isEditing,
    isAdmin,
    statusMapping,
    setIsEditing,
    handleInputChange,
    handleSave
  };
}
