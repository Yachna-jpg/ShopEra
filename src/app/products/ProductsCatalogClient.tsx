"use client";

import React, { useState } from "react";
import ProductCardClient from "./ProductCardClient";
import ProductQuickViewModal, { QuickViewProduct } from "@/components/ProductQuickViewModal";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: { id: string; name: string };
};

export default function ProductsCatalogClient({ products }: { products: Product[] }) {
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3500);
  };

  const handleOpenQuickView = (prod: Product) => {
    setQuickViewProduct({
      id: prod.id,
      name: prod.name,
      price: prod.price,
      description: prod.description,
      imageUrl: prod.imageUrl || "",
      category: prod.category?.name || "Collection",
      rating: 4.9,
      reviewsCount: 128,
      galleryImages: prod.imageUrl ? [prod.imageUrl] : [],
    });
  };

  const handleAddToCart = async (prod: QuickViewProduct) => {
    if (!user) {
      showToast("Please log in to add items to your cart");
      return;
    }
    try {
      await addToCart(prod.id, 1);
      showToast(`Added "${prod.name}" to bag!`);
    } catch (e: any) {
      showToast(e.message || "Failed to add to bag");
    }
  };

  return (
    <>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[180] px-5 py-4 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[22px] text-secondary">check_circle</span>
          <span className="font-label-md text-label-md font-medium">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter-desktop">
        {products.map((product) => (
          <ProductCardClient
            key={product.id}
            product={product}
            onQuickView={handleOpenQuickView}
          />
        ))}
      </div>

      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </>
  );
}
