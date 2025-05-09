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

type Props = {
  services: Service[];
};

export function ServiceList() {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const { services} = ServiceListHook();  
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue.trim());
  };

  const filtered = services.filter(service =>
    `${service.city} ${service.street} ${service.house} ${service.apartment}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <main>
        <h2>Список подключённых квартир</h2>

        <form className={styles.searchForm} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Поиск по городу, улице, дому, квартире"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
          <button type="submit">Искать</button>
        </form>

        {filtered.length > 0 ? (
          <div className={styles.cardList}>
            {filtered.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <p>Нет доступных квартир.</p>
        )}
      </main>
    </div>
  );
}
