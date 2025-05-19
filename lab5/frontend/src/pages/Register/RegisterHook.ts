import { useState } from 'react';
import { Hook } from './../../Hook';

export function RegisterHook() {
    const { navigate } = Hook(); // Получаем navigate из основного хука
    const [error, setError] = useState<string | null>(null);

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
        const response = await fetch('/api/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                email,
                password,
                first_name,
                last_name,
                middle_name
            })
        });

        if (response.ok) {
            // console.log(await response.json())
            return await response.json();
        } else {
            throw new Error('Ошибка регистрации');
        }
    } catch (error) {
        console.error("Ошибка при регистрации", error);
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
        console.log("Ответ от сервера:", data);
        if (data) {
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('user', JSON.stringify({ username }));
            navigate('/services');
        } else {
            setError('Ошибка регистрации. Проверьте данные.');
        }
    } catch (error) {
        setError('Ошибка сети или сервер недоступен.');
    }
};


    return {
        error,
        handleSubmit,
        goToLogin,
        handleGoBack
    };
}