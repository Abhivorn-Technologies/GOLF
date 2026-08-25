"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProductType } from '@/data/products';

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface CartItem {
  cartItemId: string;
  product: ProductType;
  quantity: number;
  variants?: Record<string, string>;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductType, quantity: number, variants?: Record<string, string>) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemVariants: (cartItemId: string, variants: Record<string, string>) => void;
  cartCount: number;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);

  const addToCart = (product: ProductType, quantity: number, variants?: Record<string, string>) => {
    setCartItems(prev => {
      // Create a unique ID based on product ID and variants
      const sortedVariants = variants ? Object.entries(variants).sort().toString() : '';
      const cartItemId = `${product.id}-${sortedVariants}`;

      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => 
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { cartItemId, product, quantity, variants }];
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    setCartItems(prev => prev.map(item => 
      item.cartItemId === cartItemId 
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    ));
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateCartItemVariants = (cartItemId: string, variants: Record<string, string>) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        // Calculate the new cartItemId
        const sortedVariants = Object.entries(variants).sort().toString();
        const newCartItemId = `${item.product.id}-${sortedVariants}`;
        
        // Note: If an item with this newCartItemId already exists, ideally we'd merge them. 
        // For simplicity, we just update this item's variants and ID.
        return { ...item, variants, cartItemId: newCartItemId };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeFromCart, updateCartItemVariants, cartCount,
      shippingAddress, setShippingAddress, clearCart 
    }}>
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
