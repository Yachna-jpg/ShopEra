"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
};

type Cart = {
  id: string;
  items: CartItem[];
};

import { apiFetch } from "@/lib/api";

export default function CartPage() {
  const router = useRouter();
  const { cart, isLoading: loading, updateItem, removeItem, fetchCart } = useCart();
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    fetchCart();
  }, []);

  async function handleCheckout() {
    try {
      const data = await apiFetch("/api/checkout", { method: "POST" });
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        setToast({ visible: true, message: "Checkout failed: Missing URL" });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      }
    } catch (e: any) {
      setToast({ visible: true, message: e.message || "Checkout failed" });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading cart..." />;
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl animate-in fade-in">
          {toast.message}
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet."
          actionLabel="Continue Shopping"
          actionHref="/"
        />
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow flex gap-4 items-center">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  {item.product.imageUrl && (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.name}</h2>
                  <p className="text-blue-600 font-medium">
                    ${(item.product.price / 100).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 border rounded"
                  >-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="w-8 h-8 border rounded"
                  >+</button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="block w-full text-center bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
    </>
  );
}
