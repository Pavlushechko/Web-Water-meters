
import React, { useState } from 'react';
import { RegisterHook } from "./RegisterHook";
import styles from './Register.module.css'; // Импортируем стили из .module.css

export function Register() {
    const [username, setUsername] = useState('');
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLastName] = useState('');
    const [middle_name, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { error, handleSubmit, goToLogin, handleGoBack } = RegisterHook();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSubmit(username, email, password, first_name, last_name, middle_name);
    };


    return (
        <div className={styles.register_container}>
            <h2>Регистрация</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="username">Ник пользователя:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last_name">Фамилия:</label>
                    <input
                        type="text"
                        id="last_name"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="first_name">Имя:</label>
                    <input
                        type="text"
                        id="first_name"
                        value={first_name}
                        onChange={(e) => setFirst_name(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="middle_name">Отчество:</label>
                    <input
                        type="text"
                        id="middle_name"
                        value={middle_name}
                        onChange={(e) => setMiddleName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // required
                    />
                </div>
                <div>
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button className={styles.button} type="submit">Зарегистрироваться</button>
            </form>


            <div className={styles.login_link}>
                <p>Уже есть аккаунт? <button className={styles['login-button']} onClick={goToLogin}>Войти</button></p>
            </div>

            <button 
                type="button"
                className={styles['back-button']}
                onClick={handleGoBack}
            >
                Назад
            </button>
        </div>
    );
}
