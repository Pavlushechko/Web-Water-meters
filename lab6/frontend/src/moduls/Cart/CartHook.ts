import { useEffect } from 'react';
import { isAxiosError } from 'axios'; // Импортируем axios и тип AxiosError
import axiosClient from "./../../Clients"
import type { CartItem } from '../../pages/ServiceDetail/ServiceDetail';

export function CartHook(cartItems: CartItem[], setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>) {
    // Загрузка корзины из localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, [setCartItems]);

    // Удаление товара из корзины
    const removeFromCart = (index: number) => {
        const updatedCart = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    // Подтверждение заявки
    const confirmApplication = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) throw new Error("Access token missing");

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userId = payload.user_id;

            for (const item of cartItems) {
                const applicationResponse = await axiosClient.post('/api/applications/', {
                    status: 'formatted',
                    created_at: new Date().toISOString(),
                    creator: userId,
                });

                await axiosClient.post('/api/application-services/', {
                    application: applicationResponse.data.id,
                    service_id: item.id,
                    gvs: parseInt(item.gvs ?? '0'),
                    hvs: parseInt(item.hvs ?? '0'),
                });
            }

            setCartItems([]);
            localStorage.removeItem('cart');

        } catch (error) {
            if (isAxiosError(error)) {
                console.error('Ошибка сервера:', error.response?.data);
            } else {
                console.error('Ошибка:', error);
            }
        }
    };


    return {
        removeFromCart,
        confirmApplication
    };
}