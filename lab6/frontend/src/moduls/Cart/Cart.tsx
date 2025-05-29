import styles from './Cart.module.css'; // Путь к стилям корзины
import { CartHook } from './CartHook';  // Импортируем хук для корзины
import type { CartItem } from '../../pages/ServiceDetail/ServiceDetail';

export function Cart({ cartItems, setCartItems}: { cartItems: CartItem[], setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;}) {
    const { removeFromCart, confirmApplication } = CartHook(cartItems, setCartItems);  // Используем хук
    return (
        <div className={styles.cartContainer}>
            <h3 className={styles.title}>Корзина</h3>
            {cartItems.length > 0 ? (
                <div>
                    <ul className={styles.cartList}>
                        {cartItems.map((item, index) => (
                            <li key={index} className={styles.card}>
                            <div className={styles.cardTextBlock}>
                                <div className={styles.cardContent}>
                                <h2 className={styles.cardTitle}>
                                    {item.city}, ул. {item.street}, д. {item.house}, кв. {item.apartment}
                                </h2>
                                <p className={styles.description}><strong>ГВС:</strong> {item.gvs} | <strong>ХВС:</strong> {item.hvs}</p>
                                <p className={styles.description}><strong>Хозяева:</strong> {item.owners}</p>
                                </div>
                                <div className={styles.buttons}>
                                <button onClick={() => removeFromCart(index)} className={styles.removeButton}>
                                    Удалить из корзины
                                </button>
                                </div>
                            </div>
                            <img className={styles.image} src={item.image} alt="Фото квартиры" />
                            </li>
                        ))}
                    </ul>
                    <button className={styles.confirmButton} onClick={confirmApplication}>
                        Подтвердить добавление в заявки
                    </button>
                </div>
            ) : (
                <p>Корзина пуста.</p>
            )}
        </div>
    );
}