import { useState, useEffect } from 'react';
import axiosClient from "./../../Clients"

export function ServiceListHook(searchQuery: string = '') {
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

        const response = await axiosClient.get("/api/services/", {
          params: {
            page: page,
            search: searchQuery.trim() || undefined
          }
        });

        setServices(prev =>
          page === 1 ? response.data.results : [...prev, ...response.data.results]
        );
        setHasMore(!!response.data.next);
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
