import { useLocation, Link, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import { ServiceList } from './pages/ServiceList/ServiceList';
import { ServiceCard } from './pages/ServiceCard/ServiceCard';
import { ServiceDetail } from './pages/ServiceDetail/ServiceDetail';
import { Applications } from './pages/Applications/Applications';

const services = [
  {
    id: 1,
    city: "Москва",
    street: "Тверская",
    house: "12",
    apartment: "34",
    image: "https://storage.yandexcloud.net/storage.ardera-static.ru/products/891/normal_aba554ff68c7da31.jpg",
    ownerships: [
      {
        user: {
          first_name: "Иван",
          last_name: "Иванов",
          patronymic: "Петрович",
        },
      },
    ],
  },
  {
    id: 2,
    city: "Санкт-Петербург",
    street: "Невский проспект",
    house: "7",
    apartment: "56",
    image: "https://via.placeholder.com/120x80",
    ownerships: [],
  },
];

const applications = [
  {
    id: 1,
    status: "В обработке",
    created_at: "2025-05-01T10:00:00Z",
    completion_date: null,
  },
  {
    id: 2,
    status: "Завершена",
    created_at: "2025-04-20T14:30:00Z",
    completion_date: "2025-04-25T09:15:00Z",
  },
  {
    id: 3,
    status: "Отклонена",
    created_at: "2025-03-15T08:00:00Z",
    completion_date: "2025-03-16T17:45:00Z",
  },
];

const App = () => {
  const location = useLocation();

  return (
    <>
      <div className={styles.container}>
        <div>
          <h1>Water Meters</h1>
          <p className={styles.tagline}>установка - передача счётчиков</p>
          <p className={styles.supportInfo}>
            <span className={styles.supportText}>Поддержка - </span>
            <a href="mailto:pavlushechko@gmail.com" className={styles.supportLink}>
              pavlushechko@gmail.com
            </a>
          </p>
        </div>
        <img 
          src="/static/main/images/logo.png" 
          alt="Water Meters Logo" 
          className={styles.logo}
        />

        <div className={styles.buttonContainer}>
          {location.pathname !== "/applications" && (
            <Link to="/applications">
              <button className={styles.navButton}>Заявки</button>
            </Link>
          )}
          {location.pathname !== "/services" && (
            <Link to="/services">
              <button className={styles.navButton}>Услуги</button>
            </Link>
          )}
        </div>
      </div>

      <Routes>
          <Route path="/services">
            <Route index element={<ServiceList/>}/>
            <Route path=":id" element={<ServiceDetail />} />
          </Route>
          <Route
            path="/applications"
            element={<Applications applications={applications} />}
          />
      </Routes>
    </>
  );
};

export default App;


