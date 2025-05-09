import styles from "./ServiceCard.module.css";
import { Link } from 'react-router-dom';

type UserProfile = {
  middle_name: string;
};

type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile: UserProfile;
};

type Service = {
  id: number | string;
  image: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  gvs?: string;
  hvs?: string;
  owners: User[];
};

type Props = {
  service: Service;
};

export function ServiceCard({ service }: Props) {
  const fullAddress = `${service.city}, ул. ${service.street}, д. ${service.house}, кв. ${service.apartment}`;
  
  const owners = service.owners.length > 0
    ? service.owners
        .map((owner) => {
          const { first_name, last_name, profile } = owner;
          return `${last_name} ${first_name}${profile.middle_name ? ' ' + profile.middle_name : ''}`;
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