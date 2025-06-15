// ServiceListHook.ts
import { useState, useEffect } from 'react';
import axiosClient from "./../../Clients";
import DEFAULT_IMAGE from "../../assets/mock.jpg";

// Мок-данные для сервисов
const mockServices = [
  {
    id: 1,
    image: DEFAULT_IMAGE,
    city: "Москва",
    street: "Ленина",
    house: "10",
    apartment: "25",
    gvs: "Есть",
    hvs: "Есть",
    owners: [
      {
        id: 1,
        first_name: "Иван",
        last_name: "Иванов",
        email: "ivan@example.com",
        profile: {
          middle_name: "Иванович"
        }
      }
    ]
  },
  {
    id: 2,
    image: DEFAULT_IMAGE,
    city: "Санкт-Петербург",
    street: "Пушкина",
    house: "5",
    apartment: "13",
    owners: [
      {
        id: 2,
        first_name: "Петр",
        last_name: "Петров",
        email: "petr@example.com",
        profile: {
          middle_name: "Петрович"
        }
      },
      {
        id: 3,
        first_name: "Светлана",
        last_name: "Сидорова",
        email: "svetlana@example.com",
        profile: {
          middle_name: "Игоревна"
        }
      }
    ]
  }
];

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
        }).catch(() => {
          // При ошибке возвращаем мок-данные
          return {
            data: {
              results: mockServices.filter(service => 
                `${service.city} ${service.street} ${service.house} ${service.apartment}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              ),
              next: null
            }
          };
        });

        setServices(prev =>
          page === 1 ? response.data.results : [...prev, ...response.data.results]
        );
        setHasMore(!!response.data.next);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Неизвестная ошибка'));
        // При ошибке используем мок-данные
        setServices(mockServices);
        setHasMore(false);
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