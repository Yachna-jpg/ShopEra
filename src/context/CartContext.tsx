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
  getItemQuantity: (productId: string) => number;
  getItemInCart: (productId: string) => CartItem | undefined;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const cartCount = Array.isArray(cart?.items) 
    ? cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0) 
    : 0;

  async function fetchCart() {
    if (!user) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const data = await apiFetch("/api/cart");
      if (data && Array.isArray(data.items)) {
        setCart(data);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, [user]);

  function getItemInCart(productId: string): CartItem | undefined {
    if (!cart || !Array.isArray(cart.items)) return undefined;
    return cart.items.find((item) => item.productId === productId);
  }

  function getItemQuantity(productId: string): number {
    const item = getItemInCart(productId);
    return item ? item.quantity : 0;
  }

  async function addToCart(productId: string, quantity: number = 1) {
    if (!user) throw new Error("Must be logged in to add to cart");
    
    const data = await apiFetch("/api/cart", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
    if (data && Array.isArray(data.items)) {
      setCart(data);
    }
  }

  async function updateItem(itemId: string, quantity: number) {
    if (!user) return;
    
    if (quantity <= 0) {
      return removeItem(itemId);
    }

    const data = await apiFetch(`/api/cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    });
    if (data && Array.isArray(data.items)) {
      setCart(data);
    }
  }

  async function removeItem(itemId: string) {
    if (!user) return;
    
    const data = await apiFetch(`/api/cart/items/${itemId}`, {
      method: "DELETE",
    });
    if (data && Array.isArray(data.items)) {
      setCart(data);
    }
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      isLoading, 
      addToCart, 
      updateItem, 
      removeItem, 
      fetchCart,
      getItemQuantity,
      getItemInCart
    }}>
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
