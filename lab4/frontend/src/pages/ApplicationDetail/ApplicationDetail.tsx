import { useParams } from 'react-router-dom';
import { useApplicationDetail } from './ApplicationDetailHook';

export function ApplicationDetail() {
  const { id } = useParams();
  const { application, loading, error } = useApplicationDetail(id);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!application) return <p>Заявка не найдена</p>;

  return (
    <div>
      <h2>Заявка #{application.id}</h2>
      <p>Статус: {application.status}</p>
      <p>Создана: {new Date(application.created_at).toLocaleString('ru-RU')}</p>
      <p>Завершена: {application.completion_date ? new Date(application.completion_date).toLocaleString('ru-RU') : 'Нет'}</p>
    </div>
  );
}
