"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ProductType } from '@/data/products';

export interface ShippingAddress {
  name: string;
  houseNumber?: string;
  street: string;
  area?: string;
  landmark?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
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
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress) => void;
  couponCode: string | null;
  couponDiscount: number;
  setCoupon: (code: string | null, discount: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [couponCode, setCouponCodeState] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscountState] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('golf_cartItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Failed to parse cart items from localStorage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when cart changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('golf_cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

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
    setShippingAddress(null);
    setCouponCodeState(null);
    setCouponDiscountState(0);
    localStorage.removeItem('golf_cartItems');
  };

  const setCoupon = (code: string | null, discount: number) => {
    setCouponCodeState(code);
    setCouponDiscountState(discount);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const parsePrice = (price: any) => {
    if (typeof price === 'number') return price;
    const parsed = parseFloat(price?.toString().replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (parsePrice(item.product.price) * item.quantity);
  }, 0);

  const shipping = subtotal > 0 ? (subtotal > 10000 ? 0 : 500) : 0;
  const taxes = subtotal * 0.18;
  const total = subtotal + shipping + taxes - couponDiscount;

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, updateQuantity, removeFromCart, updateCartItemVariants, cartCount,
      subtotal, shipping, taxes, total,
      shippingAddress, setShippingAddress, couponCode, couponDiscount, setCoupon, clearCart 
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
