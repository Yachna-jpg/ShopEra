"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import LuxurySkeleton from "@/components/LuxurySkeleton";

export default function CartPage() {
  const { user, logout } = useAuth();
  const { cart, isLoading: loading, updateItem, removeItem, fetchCart, cartCount } = useCart();
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    fetchCart();
  }, []);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3000);
  };

  if (loading) {
    return <LuxurySkeleton type="cart" />;
  }

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen flex flex-col justify-between">
      {/* Toast Feedback Card */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[100] px-5 py-3.5 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-3 font-body-md text-body-md border border-outline-variant/30">
          <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
          <span>{toast.message}</span>
        </div>
      )}



      {/* Main Cart Content */}
      <main className="w-full pt-28 pb-20 flex-grow">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop">
          <div className="mb-space-xl">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Shopping Bag</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mt-1">
              Your Curated Cart ({items.length} {items.length === 1 ? "item" : "items"})
            </h1>
          </div>

          {items.length === 0 ? (
            <div className="bg-surface-container-low rounded-3xl p-space-2xl text-center flex flex-col items-center gap-4 max-w-lg mx-auto border border-outline-variant/30 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Your bag is empty</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Explore our sustainable fashion, lifestyle essentials, and curated drops.
              </p>
              <Link
                href="/products"
                className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface hover:bg-on-surface font-label-md text-label-md inline-flex items-center gap-space-xs transition-transform hover:scale-[1.01] shadow-sm mt-2"
              >
                <span>Explore Shop</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-space-md">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 border border-outline-variant/20 shadow-sm flex flex-col sm:flex-row gap-space-md items-start sm:items-center justify-between"
                  >
                    <div className="flex gap-space-md items-center">
                      <div className="w-24 h-28 rounded-xl bg-surface-variant overflow-hidden flex-shrink-0 relative">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-caption text-caption bg-surface-container-highest">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Link href={`/products/${item.product.id}`} className="font-headline-sm text-headline-sm text-on-surface font-medium hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          ${(item.product.price / 100).toFixed(2)}
                        </span>
                        <span className="font-caption text-caption text-on-surface-variant">In Stock • Ships in 24h</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-space-xs sm:pt-0 border-outline-variant/20">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-surface-container p-1 rounded-full border border-outline-variant/30">
                        <button
                          onClick={async () => {
                            if (item.quantity > 1) {
                              await updateItem(item.id, item.quantity - 1);
                              showToast("Updated item quantity");
                            } else {
                              await removeItem(item.id);
                              showToast("Removed item from cart");
                            }
                          }}
                          className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors shadow-xs"
                          type="button"
                          aria-label="Decrease quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-7 text-center font-label-md text-label-md font-semibold text-on-surface">
                          {item.quantity}
                        </span>
                        <button
                          onClick={async () => {
                            await updateItem(item.id, item.quantity + 1);
                            showToast("Updated item quantity");
                          }}
                          className="w-8 h-8 rounded-full bg-surface hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors shadow-xs"
                          type="button"
                          aria-label="Increase quantity"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="font-headline-sm text-headline-sm text-on-surface font-bold sm:min-w-[80px] text-right">
                        ${((item.product.price * item.quantity) / 100).toFixed(2)}
                      </span>

                      {/* Remove Button */}
                      <button
                        onClick={async () => {
                          await removeItem(item.id);
                          showToast("Removed item from bag");
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                        type="button"
                        title="Remove item"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-4 bg-surface-container-low p-space-xl rounded-3xl border border-outline-variant/30 shadow-sm space-y-space-md sticky top-28">
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Order Summary</h2>

                <div className="space-y-space-xs border-b border-outline-variant/20 pb-space-md font-body-md text-body-md">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span className="font-medium text-on-surface">${(total / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Shipping</span>
                    <span className="text-secondary font-medium">{total >= 10000 ? "Free" : "$15.00"}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Estimated Tax</span>
                    <span className="font-medium text-on-surface">Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline font-headline-md text-headline-md font-bold text-on-surface pt-space-xs">
                  <span>Total</span>
                  <span>${((total + (total >= 10000 ? 0 : 1500)) / 100).toFixed(2)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="w-full h-14 rounded-full bg-inverse-surface text-inverse-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 hover:bg-on-surface transition-all shadow-md transform hover:scale-[1.01] mt-2"
                >
                  <span>Proceed to Checkout</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>

                <p className="font-caption text-caption text-on-surface-variant text-center pt-2">
                  🔒 Encrypted 256-bit SSL Checkout • Free returns within 30 days
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
