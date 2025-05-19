import { useLocation, Link, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import { ServiceList } from './pages/ServiceList/ServiceList';
import { ServiceDetail } from './pages/ServiceDetail/ServiceDetail';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Hook } from './Hook';
import { Applications } from './pages/Applications/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail/ApplicationDetail';
import { useEffect, useState } from "react";

const App = () => {
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  const { isLoggedIn, handleLogout } = Hook();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUsername(parsed.username);
      } catch (e) {
        console.error("Failed to parse user data", e);
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
  }, [location, isLoggedIn]);

  return (
    <>
    <nav className={styles.container}>
      <div className={styles.AuthBlock}>
        <div className={styles.username}>
          Логин: {isLoggedIn ? (username || 'Гость') : 'Гость'}
        </div>
        {!isLoggedIn ? (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login">
                <button className={styles.navButton}>Вход</button>
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register">
                <button className={styles.navButton}>Регистрация</button>
              </Link>
            )}
          </>
        ) : (
          <button 
            className={styles.navButton}
            onClick={handleLogout}
          >
            Выйти из аккаунта
          </button>
        )}
      </div>

        <div className={styles.headerBlock}>
          <img
            src="http://localhost:9001/api/v1/buckets/image/objects/download?preview=true&prefix=logo.png&version_id=null"
            alt="Water Meters Logo"
            className={styles.logo}
          />
          <div className={styles.textContent}>
            <h1>Water Meters</h1>
            <p className={styles.tagline}>установка - передача счётчиков</p>
            <p className={styles.supportInfo}>
              <span className={styles.supportText}>Поддержка - </span>
              <a
                href="mailto:pavlushechko@gmail.com"
                className={styles.supportLink}
              >
                pavlushechko@gmail.com
              </a>
            </p>
          </div>
        </div>


        <div className={styles.buttonContainer}>
          {isLoggedIn && (
            <>
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
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services">
          <Route index element={<ServiceList />} />
          <Route path=":id" element={<ServiceDetail />} />
        </Route>
        <Route path="/applications" element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
      </Routes>
    </>
  );
};

export default App;