import styles from "./ServiceCard.module.css";
import { Link } from 'react-router-dom';

type User = {
  first_name: string;
  last_name: string;
  patronymic?: string | null;
  email: string;  // Добавлен email для полноты информации владельца
};

type Service = {
  id: number | string;
  image: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  owners: User[];  // Используем owners вместо ownerships
};

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  const fullAddress = `${service.city}, ул. ${service.street}, д. ${service.house}, кв. ${service.apartment}`;
  
  const owners = service.owners.length > 0
    ? service.owners
        .map((o) => {
          const { first_name, last_name, patronymic } = o;
          return `${first_name} ${last_name}${patronymic ? ' ' + patronymic : ''}`;
        })
        .join(', ')
    : 'Нет хозяев';

  return (
    <Link to={`/services/${service.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.cardImage}>
          <img src={service.image} alt="Фото дома" />
        </div>
        <div className={styles.cardInfo}>
          <h3>{fullAddress}</h3>
          <p>
            <strong>Хозяева:</strong> {owners}
          </p>
        </div>
      </div>
    </Link>
  );
}
