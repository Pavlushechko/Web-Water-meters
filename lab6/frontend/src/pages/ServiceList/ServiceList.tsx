import React, { useState } from 'react';
import { ServiceListHook } from './ServiceListHook';
import { ServiceCard } from '../ServiceCard/ServiceCard';
import { ServiceDetailHook } from '../ServiceDetail/ServiceDetailHook';
import styles from "./ServiceList.module.css";
import CartIcon from "../../assets/CartIcon.png";
import { Cart } from '../../moduls/Cart/Cart';

export function ServiceList() {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });


  const { services, loadMore, hasMore, isLoading, error } = ServiceListHook(search);
  const { toggleCartVisibility, isCartVisible } = ServiceDetailHook();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(inputValue);
  };

  if (error) return <div>Ошибка: {error.message}</div>;
  console.log()
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

        {cartItems.length > 0 && (
          <img
            className={styles.cart}
            onClick={toggleCartVisibility}
            src={CartIcon}
            alt="Корзина"
            title="Документы в корзине"
          />
        )}

        {isCartVisible && cartItems.length > 0 && (
          <Cart
            cartItems={cartItems}
            setCartItems={setCartItems}
          />
        )}
      </main>
    </div>
  );
}
