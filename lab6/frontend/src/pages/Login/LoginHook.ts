import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login_slice } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../Clients'; 
import { isAxiosError } from 'axios';

export function LoginHook() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState<string | null>(null);

    const goToRegister = () => navigate('/register');
    const handleGoBack = () => navigate("-1");
    const goToServices = () => navigate('/services');
    
    const login = async (username: string, password: string) => {
        try {
            setError(null); // Очищаем предыдущие ошибки
            
            // Используем axiosClient вместо fetch
            const response = await axiosClient.post('/api/token/', { 
                username, 
                password 
            });

            // При успешном ответе сохраняем токены
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify({ username }));
            
            return true;
        } catch (error: any) {
            let errorMessage = 'Ошибка авторизации';
            
            if (isAxiosError(error)) {
                // Обрабатываем axios-ошибки
                if (error.response) {
                    errorMessage = error.response.data.detail?.includes('No active account found') 
                        ? 'Введен неправильный логин или пароль.'
                        : error.response.data.detail || 'Ошибка авторизации';
                } else if (error.request) {
                    errorMessage = 'Сервер не отвечает';
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
            console.error('Login error:', error);
            return false;
        }
    };

    const handleSubmit = async (username: string, password: string) => {
        try {
            const success = await login(username, password);
            if (success) {
                dispatch(login_slice({ username }));
                navigate('/services');
            }
        } catch (error) {
            setError(
                error instanceof Error 
                    ? error.message 
                    : 'Ошибка сети или сервер недоступен.'
            );
        }
    };

    return {
        error,
        handleSubmit,
        goToRegister,
        handleGoBack,
        goToServices
    };
}