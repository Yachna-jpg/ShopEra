"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "./AuthContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
};

type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

type CartContextType = {
  cart: Cart | null;
  cartCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  fetchCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const cartCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  async function fetchCart() {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await apiFetch("/api/cart");
      setCart(data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, [user]);

  async function addToCart(productId: string, quantity: number = 1) {
    if (!user) throw new Error("Must be logged in to add to cart");
    
    const data = await apiFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    setCart(data);
  }

  async function updateItem(itemId: string, quantity: number) {
    if (!user) return;
    
    // In a real implementation we would call a PUT endpoint, e.g. /api/cart/items/[id]
    const data = await apiFetch(`/api/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    setCart(data);
  }

  async function removeItem(itemId: string) {
    if (!user) return;
    
    // In a real implementation we would call a DELETE endpoint
    const data = await apiFetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
    });
    setCart(data);
  }

  return (
    <CartContext.Provider value={{ cart, cartCount, isLoading, addToCart, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
