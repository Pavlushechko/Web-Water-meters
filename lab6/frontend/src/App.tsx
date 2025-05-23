import { useLocation, Link, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import { ServiceList } from './pages/ServiceList/ServiceList';
import { ServiceDetail } from './pages/ServiceDetail/ServiceDetail';
import { Login } from './pages/Login/Login';
import { Register } from './pages/Register/Register';
import { Hook } from './Hook';
import { Applications } from './pages/Applications/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail/ApplicationDetail';
import { ProtectedRoute } from './ProtectedRoute';
import { useSelector } from 'react-redux';
import type { RootState } from './redux/store'; 
import logo from './assets/logo.png';

const App = () => {
  const location = useLocation();
  const { isLoggedIn, handleLogout } = Hook();
  
  // Получаем данные из Redux store
  const username = useSelector((state: RootState) => state.user.username);

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
            src={logo} 
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
        {/* Защищенные маршруты для неавторизованных (inverse=true) */}
        <Route path="/login" element={
          <ProtectedRoute inverse>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute inverse>
            <Register />
          </ProtectedRoute>
        } />
        
        {/* Обычные защищенные маршруты (только для авторизованных) */}
        <Route path="/services">
          <Route 
            index 
            element={
              <ProtectedRoute>
                <ServiceList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path=":id" 
            element={
              <ProtectedRoute>
                <ServiceDetail />
              </ProtectedRoute>
            } 
          />
        </Route>

        <Route path="/applications">
          <Route 
            index 
            element={
              <ProtectedRoute>
                <Applications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path=":id" 
            element={
              <ProtectedRoute>
                <ApplicationDetail />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;