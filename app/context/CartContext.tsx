'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from local storage', error);
    }
    setIsInitialized(true);
  }, []);

  // Save to local storage when cart changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = (item: CartItem) => {
    const sanitizedItem = {
      ...item,
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1
    };

    setCart((prev) => {
      const existing = prev.find((i) => 
        i._id === sanitizedItem._id && 
        i.selectedColor === sanitizedItem.selectedColor && 
        i.selectedSize === sanitizedItem.selectedSize
      );
      if (existing) {
        return prev.map((i) =>
          (i._id === sanitizedItem._id && 
           i.selectedColor === sanitizedItem.selectedColor && 
           i.selectedSize === sanitizedItem.selectedSize) 
          ? { ...i, quantity: (Number(i.quantity) || 0) + sanitizedItem.quantity } 
          : i
        );
      }
      return [...prev, sanitizedItem];
    });
  };

  const removeFromCart = (id: string, color?: string, size?: string) => {
    setCart((prev) => prev.filter((item) => 
      !(item._id === id && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const updateQuantity = (id: string, quantity: number, color?: string, size?: string) => {
    const numQuantity = Number(quantity) || 0;
    if (numQuantity <= 0) {
      removeFromCart(id, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => 
        (item._id === id && item.selectedColor === color && item.selectedSize === size) 
        ? { ...item, quantity: numQuantity } 
        : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
