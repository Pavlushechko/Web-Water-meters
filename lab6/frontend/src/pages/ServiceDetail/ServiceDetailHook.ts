import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Service, CartItem } from './ServiceDetail';
import axiosClient from '../../Clients';

export function ServiceDetailHook(gvs: string = '', hvs: string = '') {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // --- Новое: состояния для корзины и функции управления ---

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);

  // Функция для добавления товара в корзину
  const addToCart = (
    id: number | string,
    city: string,
    house: string,
    street: string,
    gvs: string | undefined,
    apartment: string,
    hvs: string | undefined,
    owners: string
  ) => {
    // Получаем текущую корзину из localStorage
    const savedCart = localStorage.getItem('cart');
    const cartItems: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    // Проверяем, есть ли элемент с таким id
    if (!cartItems.some(item => item.id === id)) {
      const newItem: CartItem = {
        id,
        city,
        house,
        street,
        gvs,
        apartment,
        hvs,
        owners,
        image: service?.image || '',
      };

      const updatedCart = [...cartItems, newItem];

      // Сохраняем обратно в localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      // Обновляем локальное состояние корзины (если есть)
      setCartItems(updatedCart);

      // Можно дополнительно показывать корзину
      setIsCartVisible(true);
    }
  };


  // Функция для отображения/скрытия корзины
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  // Загрузка сохраненной корзины из localStorage
  useEffect(() => {
    if (!isCartLoaded) {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      setIsCartLoaded(true);
    }
  }, [isCartLoaded]);

  // Сохранение корзины в localStorage и управление видимостью
  useEffect(() => {
    if (cartItems.length === 0) {
      setIsCartVisible(false);
    }
    if (isCartLoaded) localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems, isCartLoaded]);

  // --- Конец блока корзины ---

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosClient.get(`/api/services/${id}/`);
        setService(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitted(false);
      // 1. Создаем заявку
      const applicationResponse = await axiosClient.post('/api/applications/', {status: 'formatted'});
      const applicationId = applicationResponse.data.id;
      const gvsInt = parseInt(gvs) || 0;
      const hvsInt = parseInt(hvs) || 0;

      // 2. Добавляем услугу к заявке
      await axiosClient.post('/api/application-services/', {
        application: applicationId,
        service_id: service?.id,
        gvs: gvsInt,
        hvs: hvsInt,
      });

      setSubmitted(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при отправке';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  return { 
    service, 
    loading, 
    error, 
    handleSubmit, 
    submitted, 

    // Возвращаем управление корзиной наружу
    cartItems, 
    isCartVisible, 
    addToCart, 
    toggleCartVisibility 
  };
}
