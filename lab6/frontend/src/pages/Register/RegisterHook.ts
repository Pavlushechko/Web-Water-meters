import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login_slice } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import axiosClient from "./../../Clients";
import { isAxiosError } from 'axios';

export function RegisterHook() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const goToLogin = () => navigate('/login');
    const handleGoBack = () => {
        navigate("-1"); // На 1 страницу назад в истории
    };

    const register = async (
        username: string,
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        middle_name: string
    ) => {
        try {
            setError(null);
            
            const response = await axiosClient.post('/api/register/', {
                username,
                email,
                password,
                first_name,
                last_name,
                middle_name
            });

            return response.data;
        } catch (error: any) { // Явно указываем тип unknown
            console.error("Ошибка при регистрации", error);
            
            // Проверяем тип ошибки
            if (isAxiosError(error)) {
                // Это ошибка axios
                if (error.response) {
                    // Ошибка от сервера
                    const serverError = error.response.data?.detail || 
                                    error.response.data?.message || 
                                    'Ошибка регистрации';
                    setError(serverError);
                } else if (error.request) {
                    // Запрос был сделан, но ответ не получен
                    setError('Сервер не отвечает');
                } else {
                    // Ошибка при настройке запроса
                    setError('Ошибка при отправке данных');
                }
            } else if (error instanceof Error) {
                // Другие ошибки JavaScript
                setError(error.message);
            } else {
                // Неизвестный тип ошибки
                setError('Неизвестная ошибка');
            }
            
            return false;
        }
    };

    const handleSubmit = async (
        username: string,
        email: string,
        password: string,
        first_name: string,
        last_name: string,
        middle_name: string
    ) => {
        try {
            const data = await register(username, email, password, first_name, last_name, middle_name);
            if (data) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify({ username }));
                dispatch(login_slice({ username }));
                navigate('/services');
            }
        } catch (error) {
            // Общие ошибки уже обработаны в register()
            console.error("Ошибка в handleSubmit:", error);
        }
    };

    return {
        error,
        handleSubmit,
        goToLogin,
        handleGoBack
    };
}