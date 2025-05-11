import { useState, useEffect } from "react";

export function ServiceListHook(searchQuery: string = "") {
    const [services, setServices] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Сброс при новом поиске
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
                
                const url = new URL('/api/services/', window.location.origin);
                url.searchParams.append('page', page.toString());
                if (searchQuery) {
                    url.searchParams.append('search', searchQuery.trim());
                }

                const response = await fetch(url.toString());
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                
                const data = await response.json();
                
                setServices(prev => 
                    page === 1 ? data.results : [...prev, ...data.results]
                );
                
                // Проверяем наличие следующей страницы
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