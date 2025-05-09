import styles from './Applications.module.css';

type Application = {
  id: number | string;
  status: string;
  created_at: string | Date;
  completion_date?: string | Date | null;
};

type ApplicationsProps = {
  applications: Application[];
};

export function Applications({ applications }: ApplicationsProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Заявки</h2>

      {applications && applications.length > 0 ? (
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
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.status}</td>
                  <td>
                    {new Date(application.created_at).toLocaleString('ru-RU')}
                  </td>
                  <td>
                    {application.completion_date
                      ? new Date(application.completion_date).toLocaleString('ru-RU')
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
