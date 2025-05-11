import { ServiceListHook } from './ServiceListHook'; 
import styles from "./ServiceList.module.css";
import { ServiceCard } from '../ServiceCard/ServiceCard'; 
import React, { useState } from 'react';

type User = {
  first_name: string;
  last_name: string;
  patronymic?: string | null;
};

type Ownership = {
  user: User;
};

export type Service = {
  id: number | string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  image: string;
  ownerships: Ownership[];
};

export function ServiceList() {
    const [inputValue, setInputValue] = useState('');
    const [search, setSearch] = useState('');
    const { services, loadMore, hasMore, isLoading, error } = ServiceListHook(search);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(inputValue.trim());
    };

    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <div className={styles.container}>
            <main>
                <h2>Список подключённых квартир</h2>

                <form onSubmit={handleSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Поиск по городу, улице, дому, квартире"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                    <button type="submit">Искать</button>
                </form>

                {services.length > 0 ? (
                    <>
                        <div className={styles.cardList}>
                            {services.map(service => (
                                <ServiceCard 
                                    key={`${service.id}-${service.city}`}
                                    service={service} 
                                />
                            ))}
                        </div>
                        
                        {hasMore && (
                            <button 
                                onClick={loadMore}
                                disabled={isLoading}
                                className={styles.loadMoreButton}
                            >
                                {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
                            </button>
                        )}
                    </>
                ) : (
                    <p>Нет доступных квартир.</p>
                )}
            </main>
        </div>
    );
}
