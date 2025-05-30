import { useParams, Link } from 'react-router-dom';
import { useApplicationDetail } from './ApplicationDetailHook';
import type { ChangeEvent } from 'react';
import styles from './ApplicationDetail.module.css';
import { statusMapping } from '../Applications/ApplicationsHook';

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

function formatDateForInput(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  const tzOffset = -date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() + tzOffset * 60 * 1000);
  return adjustedDate.toISOString().slice(0, 16);
}

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    application,
    editedApplication,
    loading,
    error,
    isEditing,
    isAdmin,
    setIsEditing,
    handleInputChange,
    handleSave,
  } = useApplicationDetail(id) as {
    application: Application | null;
    editedApplication: Partial<Application> | null;
    loading: boolean;
    error: string | null;
    isEditing: boolean;
    isAdmin: boolean;
    setIsEditing: (value: boolean) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSave: () => void;
  };

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;
  if (!application || !editedApplication) return <p>Заявка не найдена</p>;

  const applicationServices = application.application_services;

  return (
    <div className={styles.container}>
      <p className={styles.pathway}>
        <Link to="/applications" className={styles.linkOnly}>
          /applications
        </Link>
        /{id}
      </p>
      <h2>Заявка #{application.id}</h2>

      <p>
        Статус:{' '}
        {isEditing && isAdmin ? (
          <select
            name="status"
            value={editedApplication.status || ''}
            onChange={handleInputChange}
            className={styles.statusSelect}
          >
            {Object.entries(statusMapping).map(([label, value]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ) : (
          application.status
        )}
      </p>

      <p>Создана: {new Date(application.created_at).toLocaleString('ru-RU')}</p>

      <p>
        Завершена:{' '}
        {isEditing && isAdmin ? (
          <input
            type="datetime-local"
            name="completion_date"
            value={formatDateForInput(editedApplication.completion_date)}
            onChange={handleInputChange}
            className={styles.editInput}
          />
        ) : application.completion_date ? (
          new Date(application.completion_date).toLocaleString('ru-RU')
        ) : (
          'Нет'
        )}
      </p>

      <p><strong>Создатель заявки:</strong> {application.creator || 'нет данных'}</p>
      <p><strong>Модератор заявки:</strong> {application.moderator || 'нет данных'}</p>

      {applicationServices.length === 0 && <p>Нет связанных услуг</p>}

      {applicationServices.map(({ id, service, gvs, hvs }: ApplicationService) => (
        <div key={id} className={styles.serviceBlock}>
          <h3>Услуга #{service.id}</h3>
          {service.image && (
            <img
              src={service.image}
              alt={`Фото услуги ${service.id}`}
              className={styles.serviceImage}
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

      <div className={styles.buttonGroup}>
        {isEditing ? (
          <>
            <button onClick={handleSave} className={styles.button}>Сохранить</button>
            <button onClick={() => setIsEditing(false)} className={styles.button}>Отмена</button>
          </>
        ) : (
          isAdmin && (
            <button onClick={() => setIsEditing(true)} className={styles.button}>Редактировать</button>
          )
        )}
      </div>
    </div>
  );

}
