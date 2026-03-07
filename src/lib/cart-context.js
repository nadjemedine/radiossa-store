"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('radiossa-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('radiossa-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find(item => 
                item._id === product._id && 
                item.selectedColor === product.selectedColor && 
                item.selectedSize === product.selectedSize
            );
            if (existing) {
                return prev.map(item =>
                    (item._id === product._id && 
                     item.selectedColor === product.selectedColor && 
                     item.selectedSize === product.selectedSize) 
                     ? { ...item, quantity: item.quantity + (product.quantity || 1) } 
                     : item
                );
            }
            return [...prev, { ...product, quantity: product.quantity || 1 }];
        });
    };

    const removeFromCart = (productId, selectedColor, selectedSize) => {
        setCart((prev) => prev.filter(item => 
            !(item._id === productId && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize)
        ));
    };

    const updateQuantity = (productId, selectedColor, selectedSize, delta) => {
        setCart((prev) => prev.map(item => {
            if (item._id === productId && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
