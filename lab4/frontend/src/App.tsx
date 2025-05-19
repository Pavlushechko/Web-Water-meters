import { useLocation, Link, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import { ServiceList } from './pages/ServiceList/ServiceList';
import { ServiceCard } from './pages/ServiceCard/ServiceCard';
import { ServiceDetail } from './pages/ServiceDetail/ServiceDetail';
import { Applications } from './pages/Applications/Applications';
import { ApplicationDetail } from './pages/ApplicationDetail/ApplicationDetail';


const App = () => {
  const location = useLocation();

  return (
    <>
      <nav className={styles.container}>
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
          src="http://localhost:9001/api/v1/buckets/image/objects/download?preview=true&prefix=logo.png&version_id=null" 
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
        
      </nav>

      <Routes>
          <Route path="/services">
            <Route index element={<ServiceList/>}/>
            <Route path=":id" element={<ServiceDetail />} />
          </Route>
          <Route
            path="/applications"
            element={<Applications  />}
          />
          <Route path="/applications/:id" element={<ApplicationDetail />} />
      </Routes>
    </>
  );
};

export default App;


