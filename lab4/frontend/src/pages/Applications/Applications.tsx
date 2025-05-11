import styles from './Applications.module.css';
import { useApplications } from './ApplicationsHook';
import { useNavigate } from 'react-router-dom';


export function Applications() {
  const { applications, loading, error } = useApplications();
  const navigate = useNavigate();

  if (loading) return <p className={styles.title}>Загрузка заявок...</p>;
  if (error) return <p className={styles.title}>Ошибка: {error}</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Заявки</h2>

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
