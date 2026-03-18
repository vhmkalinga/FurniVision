import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);
    const [items, setItems] = useState(() => {
        const stored = localStorage.getItem('fv_cart');
        return stored ? JSON.parse(stored) : [];
    });

    useEffect(() => {
        localStorage.setItem('fv_cart', JSON.stringify(items));
    }, [items]);

    const addItem = (product, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i._id === product._id);
            if (existing) {
                return prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
            }
            return [...prev, { ...product, quantity }];
        });
        setIsOpen(true);
    };

    const removeItem = (id) => setItems(prev => prev.filter(i => i._id !== id));

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) return removeItem(id);
        setItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count, isOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
