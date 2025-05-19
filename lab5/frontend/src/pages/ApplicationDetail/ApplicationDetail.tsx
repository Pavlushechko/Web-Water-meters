import { useParams } from 'react-router-dom';
import { useApplicationDetail } from './ApplicationDetailHook';


type Owner = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: { middle_name: string };
};

type Service = {
  id: number | string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  image: string;
  gvs?: string;
  hvs?: string;
  owners: Owner[];
};

type ApplicationService = {
  id: number;
  application: number;
  service: Service;
  gvs: number;
  hvs: number;
  owners: Owner[];
};

type Application = {
  id: number;
  status: string;
  created_at: string;
  form_date?: string | null;
  completion_date?: string | null;
  creator?: any;
  moderator?: any;
  application_services: ApplicationService[];
};


export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { application, loading, error } = useApplicationDetail(id) as { application: Application | null, loading: boolean, error: string | null };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!application) return <p>Заявка не найдена</p>;

  const applicationServices = application.application_services;

  return (
    <div>
      <h2>Заявка #{application.id}</h2>
      <p>Статус: {application.status}</p>
      <p>Создана: {new Date(application.created_at).toLocaleString('ru-RU')}</p>
      <p>Завершена: {application.completion_date ? new Date(application.completion_date).toLocaleString('ru-RU') : 'Нет'}</p>

      {applicationServices.length === 0 && <p>Нет связанных услуг</p>}

      {applicationServices.map(({ id, service, gvs, hvs }: ApplicationService) => (
        <div key={id} style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h3>Услуга #{service.id}</h3>
          {service.image && (
            <img
              src={service.image}
              alt={`Фото услуги ${service.id}`}
              style={{ maxWidth: '300px', borderRadius: '6px' }}
              onError={(e) => { (e.target as HTMLImageElement).src = '/path/to/default-image.jpg'; }}
            />
          )}
          <p><strong>Город:</strong> {service.city}</p>
          <p><strong>Улица:</strong> {service.street}</p>
          <p><strong>Дом:</strong> {service.house}</p>
          <p><strong>Квартира:</strong> {service.apartment}</p>
          <p><strong>Владельцы:</strong></p>
          <ul>
            {service.owners.length === 0 ? (
              <li>Нет владельцев</li>
            ) : (
              service.owners.map(owner => (
                <li key={owner.id}>
                  {owner.last_name} {owner.first_name} {owner.profile.middle_name} — {owner.email || 'нет email'}
                </li>
              ))
            )}
          </ul>
          <p><strong>Старые показания ГВС:</strong> {service.gvs}</p>
          <p><strong>Новые показания ГВС:</strong> {gvs}</p>
          <p><strong>Старые показания ХВС:</strong> {service.hvs}</p>
          <p><strong>Новые показания ХВС:</strong> {hvs}</p>
        </div>
      ))}
    </div>
  );
}
