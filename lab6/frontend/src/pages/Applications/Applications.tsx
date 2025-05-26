import { useApplications } from './ApplicationsHook';
import { useNavigate } from 'react-router-dom';
import styles from './Applications.module.css';

export function Applications() {
  const {
    applications,
    loading,
    error,
    statusMapping,
    filters,
    handleStatusChange,
    handleDateChange
  } = useApplications();
  
  const navigate = useNavigate();

  if (loading) return <p className={styles.title}>Загрузка заявок...</p>;
  if (error) return <p className={styles.title}>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Заявки</h2>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="status">Статус:</label>
          <select
            id="status"
            onChange={(e) => handleStatusChange(e.target.value)}
            value={filters.status || ''}
          >
            <option value="">Все</option>
            {Object.entries(statusMapping).map(([russian, english]) => (
              <option key={english} value={english}>{russian}</option>
            ))}
          </select>
        </div>

      <div className={styles.filterGroup}>
        <label>Дата создания:</label>
        <div>
          <label htmlFor="createdStart">С:</label>
          <input
            type="date"
            id="createdStart"
            onChange={(e) => handleDateChange('createdStart', e.target.value)}
            value={filters.createdStart || ''}
          />
        </div>
        <div>
          <label htmlFor="createdEnd">По:</label>
          <input
            type="date"
            id="createdEnd"
            onChange={(e) => handleDateChange('createdEnd', e.target.value)}
            value={filters.createdEnd || ''}
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label>Дата окончания:</label>
        <div>
          <label htmlFor="completedStart">С:</label>
          <input
            type="date"
            id="completedStart"
            onChange={(e) => handleDateChange('completedStart', e.target.value)}
            value={filters.completedStart || ''}
          />
        </div>
        <div>
          <label htmlFor="completedEnd">По:</label>
          <input
            type="date"
            id="completedEnd"
            onChange={(e) => handleDateChange('completedEnd', e.target.value)}
            value={filters.completedEnd || ''}
          />
        </div>
      </div>
    </div>


      {Array.isArray(applications) && applications.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Статус</th>
                <th>Дата начала</th>
                <th>Дата окончания</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => navigate(`/applications/${app.id}`)}
                  className={styles.row}
                >
                  <td>{app.status}</td>
                  <td>{new Date(app.created_at).toLocaleString('ru-RU')}</td>
                  <td>
                    {app.completion_date
                      ? new Date(app.completion_date).toLocaleString('ru-RU')
                      : 'Неизвестно'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className={styles.title}>Заявки не найдены.</p>
      )}
    </div>
  );
}