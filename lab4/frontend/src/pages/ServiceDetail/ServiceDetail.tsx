import { useParams, Link } from 'react-router-dom';
import styles from './ServiceDetail.module.css';
import { ServiceDetailHook } from './ServiceDetailHook'; 

type UserProfile = {
  middle_name: string;
};

type Owner = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: UserProfile;
};

export type Service = {
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

export function ServiceDetail() {
  const { service, error } = ServiceDetailHook();
  const { id } = useParams<{ id: string }>();

  if (error) {
    console.error('Ошибка загрузки данных:', error);
    return (
      <div className={`${styles.card} ${styles.errorText}`}>
        Ошибка при загрузке данных
      </div>
    );
  }

  if (!service) {
    return <div className={`${styles.card} ${styles.errorText}`}>Квартира не найдена</div>;
  }

  const owners = service.owners
    .map((owner) => {
      const { first_name, last_name, profile } = owner;
      return `${last_name} ${first_name}${profile.middle_name ? ` ${profile.middle_name}` : ''}`;
    })
    .join(', ') || 'Нет хозяев';

  return (
    <div className={styles.card}>
      <p className={styles.pathway}>/services/{id}</p>
      <h2 className={styles.title}>Информация о квартире</h2>
      <div className={styles.imageBlock}>
        <img 
          className={styles.image} 
          src={service.image} 
          alt="Фото дома" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/path/to/default-image.jpg';
          }}
        />
      </div>
      <div className={styles.info}>
        <p><strong>Город:</strong> {service.city}</p>
        <p><strong>Улица:</strong> {service.street}</p>
        <p><strong>Дом:</strong> {service.house}</p>
        <p><strong>Квартира:</strong> {service.apartment}</p>
        {service.gvs && <p><strong>ГВС:</strong> {service.gvs}</p>}
        {service.hvs && <p><strong>ХВС:</strong> {service.hvs}</p>}
        <p className={styles.ownerText}><strong>Хозяева:</strong> {owners}</p>
      </div>

      <p><strong><span className={styles.redExcl}>!!!</span> Введите только первые 5 (пять) цифр перед запятой (,).</strong></p>

      <form method="post" action="#">
        <div className={styles.detailFields}>
          <label htmlFor="gvs">ГВС1</label>
          <input
            type="text"
            inputMode="numeric"
            name="gvs"
            id="gvs"
            maxLength={5}
            className={`${styles.detailInput} ${styles.detailGvsInput}`}
            placeholder="Введите значение ГВС1"
            onInput={(e) => {
              const input = e.currentTarget;
              input.value = input.value.replace(/\D/g, '').slice(0, 5);
            }}
          />

          <label htmlFor="hvs">ХВС1</label>
          <input
            type="text"
            inputMode="numeric"
            name="hvs"
            id="hvs"
            maxLength={5}
            className={`${styles.detailInput} ${styles.detailGvsInput}`}
            placeholder="Введите значение ХВС1"
            onInput={(e) => {
              const input = e.currentTarget;
              input.value = input.value.replace(/\D/g, '').slice(0, 5);
            }}
          />

          <button type="submit" className={styles.detailSubmitButton}>Отправить заявку</button>
        </div>
      </form>

      <Link to="/services" className={styles.detailBackButton}>← Назад</Link>
    </div>
  );
}