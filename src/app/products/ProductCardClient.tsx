"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: { id: string; name: string };
};

export default function ProductCardClient({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
}) {
  const { addToCart, updateItem, getItemInCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: string }>({ visible: false, message: "" });
  const [isUpdating, setIsUpdating] = useState(false);

  const inCartItem = getItemInCart(product.id);
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  const showToast = (msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4500);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showToast("Please log in to add items to your cart", "login");
      return;
    }

    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await addToCart(product.id, 1);
    } catch (err: any) {
      showToast(err.message || "Failed to add to bag", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inCartItem || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateItem(inCartItem.id, cartQty + 1);
      showToast(`Increased "${product.name}" quantity to ${cartQty + 1}`, "success");
    } catch (err: any) {
      showToast(err.message || "Failed to update quantity", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!inCartItem || isUpdating) return;
    setIsUpdating(true);
    try {
      await updateItem(inCartItem.id, cartQty - 1);
      if (cartQty - 1 === 0) {
        showToast(`Removed "${product.name}" from bag`, "info");
      } else {
        showToast(`Updated "${product.name}" quantity to ${cartQty - 1}`, "success");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update quantity", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      showToast("Please log in to manage your wishlist", "login");
      return;
    }
    
    try {
      const res = await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });
      showToast(res.message || "Updated wishlist!", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to update wishlist", "error");
    }
  };

  return (
    <>
      {/* Toast Feedback Card with Direct Navigation Actions */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[150] px-5 py-4 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-4 border border-outline-variant/30 max-w-md">
          <span className={`material-symbols-outlined text-[24px] ${toast.type === "login" ? "text-tertiary" : "text-secondary"}`}>
            {toast.type === "login" ? "account_circle" : "check_circle"}
          </span>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-label-md font-bold truncate">{toast.message}</span>
            <span className="font-caption text-caption text-inverse-on-surface/80">Your cart is synced in real-time</span>
          </div>
          {toast.type === "login" ? (
            <button
              onClick={() => router.push("/login?callbackUrl=/products")}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:bg-secondary/90 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => router.push("/cart")}
                className="px-3 py-1 rounded-full bg-surface/20 text-inverse-on-surface hover:bg-surface/30 font-label-sm text-label-sm font-semibold transition-colors whitespace-nowrap"
              >
                View Bag
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="px-3.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:bg-secondary/90 transition-colors whitespace-nowrap"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      )}

      <div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm relative">
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
          <div
            onClick={(e) => {
              if (onQuickView) {
                e.preventDefault();
                onQuickView(product);
              }
            }}
            className="block w-full h-full cursor-pointer"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-on-surface-variant bg-surface-container-highest">
                No Image
              </div>
            )}
          </div>

          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-label-sm text-label-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md hover:bg-surface flex items-center gap-1.5 whitespace-nowrap z-10"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>Quick Preview</span>
            </button>
          )}

          {cartQty > 0 && (
            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-bold shadow-sm">
              {cartQty} in Bag
            </span>
          )}

          <button
            aria-label="Add to wishlist"
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors shadow-sm z-10"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">favorite</span>
          </button>
        </div>

        <div className="flex flex-col gap-space-xs pt-space-md px-space-xs flex-grow justify-between">
          <div>
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-medium truncate hover:text-primary transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center justify-between mt-1">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                ${(product.price / 100).toFixed(2)}
              </span>
              <span className="text-tertiary text-xs font-label-sm">{product.category?.name}</span>
            </div>
          </div>

          {/* Reactive In-Card Quantity Controller */}
          {cartQty > 0 ? (
            <div className="w-full h-11 mt-3 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-between px-2 shadow-inner">
              <button
                onClick={handleDecrement}
                disabled={isUpdating}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-50"
                title="Decrease quantity"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>

              <div className="flex items-center gap-1">
                <span className="font-label-sm text-label-sm font-bold text-on-surface">In Bag:</span>
                <span className="w-6 h-6 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center">{cartQty}</span>
              </div>

              <button
                onClick={handleIncrement}
                disabled={isUpdating || product.stock <= cartQty}
                className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-50"
                title="Increase quantity"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isUpdating}
              className="w-full h-11 mt-3 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 shadow-sm hover:bg-inverse-surface/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                add_shopping_cart
              </span>
              <span>{product.stock === 0 ? "Out of Stock" : isUpdating ? "Adding..." : "Add to Bag"}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
