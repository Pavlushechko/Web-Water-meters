import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Hook() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
    }, [location.pathname]);

    const handleNavigation = (pathname: string) => {
        if (pathname === "-1") {
            navigate(-1);
            return;
        }
        navigate(pathname);
    };

    const handleLogout = async () => {
        try {
            const token = await getAccessToken();
            const refreshToken = localStorage.getItem('refresh_token');

            if (token && refreshToken) {
                await fetch('/api/logout/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
            }

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            navigate('/login');

        } catch (error) {
            console.error('Logout failed:', error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            navigate('/login');
        }
    };

    const getAccessToken = async () => {
        let token = localStorage.getItem('access_token');
        if (token && isTokenExpired(token)) {
            token = await refreshAccessToken();
        }
        return token;
    };

    const isTokenExpired = (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return Date.now() > payload.exp * 1000;
        } catch (e) {
            return true;
        }
    };

    const refreshAccessToken = async () => {
        try {
            const refresh = localStorage.getItem("refresh");
            const response = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
            });

            if (!response.ok) {
            if (response.status === 401) {
                // 👇 Очистка токенов и выход
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                window.location.href = "/login"; // Или использовать navigate()
            }
            throw new Error("Token refresh failed");
            }

            const data = await response.json();
            localStorage.setItem("access", data.access);
            return data.access;
        } catch (error) {
            console.error("Ошибка при обновлении токена", error);
            throw error;
        }
    };


    return {
        navigate: handleNavigation,
        location,
        isLoggedIn,
        handleLogout,
        getAccessToken
    };
}