import { useState, useEffect } from 'react';
import { Hook } from '../../Hook';

export function ServiceListHook(searchQuery: string = '') {
  const { getAccessToken } = Hook();
  const [services, setServices] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setServices([]);
    setPage(1);
    setHasMore(true);
  }, [searchQuery]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = await getAccessToken();
        if (!token) throw new Error("Требуется авторизация");

        const url = new URL('/api/services/', window.location.origin);
        url.searchParams.append('page', page.toString());
        if (searchQuery) {
          url.searchParams.append('search', searchQuery.trim());
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
        const data = await response.json();

        setServices(prev =>
          page === 1 ? data.results : [...prev, ...data.results]
        );
        setHasMore(!!data.next);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [searchQuery, page]);

  return {
    services,
    loadMore: () => setPage(p => p + 1),
    hasMore,
    isLoading,
    error
  };
}
