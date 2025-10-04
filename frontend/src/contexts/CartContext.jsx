import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useAuth();

    const loadCart = async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            setCartTotal(0);
            setItemCount(0);
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.getCart();
            setCartItems(response.cartItems);
            setCartTotal(parseFloat(response.total));
            setItemCount(response.itemCount);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (coffeeType, quantity, price) => {
        if (!isAuthenticated) {
            throw new Error('Please login to add items to cart');
        }

        try {
            await apiService.addToCart(coffeeType, quantity, price);
            await loadCart(); // Reload cart after adding
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        if (!isAuthenticated) return;

        try {
            await apiService.clearCart();
            await loadCart(); // Reload cart after clearing
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    useEffect(() => {
        loadCart();
    }, [isAuthenticated]);

    const value = {
        cartItems,
        cartTotal,
        itemCount,
        loading,
        addToCart,
        clearCart,
        loadCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
