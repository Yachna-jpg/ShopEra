"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export type QuickViewProduct = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  imageUrl: string;
  galleryImages?: string[];
  stock?: number;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  colors?: string[];
};

type Props = {
  product: QuickViewProduct | null;
  onClose: () => void;
  onAddToCart: (product: QuickViewProduct) => void;
};

export default function ProductQuickViewModal({ product, onClose, onAddToCart }: Props) {
  const router = useRouter();
  const { getItemQuantity } = useCart();
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product?.imageUrl) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  if (!product) return null;

  const currentQty = getItemQuantity(product.id);
  const gallery = product.galleryImages && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.imageUrl];

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[160] flex items-center justify-center bg-on-surface/50 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-low border border-outline-variant/40 w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col md:flex-row max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-surface-container-high/90 backdrop-blur-md flex items-center justify-center text-on-surface hover:bg-surface-container-highest transition-colors shadow-sm"
          aria-label="Close modal"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Left Column: Interactive Image Gallery */}
        <div className="md:w-1/2 relative bg-surface-variant flex flex-col justify-between p-4 min-h-[320px] md:min-h-[440px]">
          <div className="relative w-full h-[320px] md:h-[360px] rounded-2xl overflow-hidden bg-surface-container-high">
            <img
              src={selectedImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.category && (
              <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-surface/90 backdrop-blur-md font-label-sm text-label-sm text-on-surface font-bold shadow-sm">
                {product.category}
              </span>
            )}
            {currentQty > 0 && (
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-bold shadow-sm">
                {currentQty} in Bag
              </span>
            )}
          </div>

          {/* Thumbnail Swatches Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImage === imgUrl
                      ? "border-primary ring-2 ring-primary/30"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                  type="button"
                >
                  <img src={imgUrl} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Detailed Product Info */}
        <div className="md:w-1/2 p-space-xl flex flex-col justify-between overflow-y-auto">
          <div className="space-y-space-md">
            <div>
              <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm mb-1">
                <div className="flex items-center gap-1 text-secondary">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold">{product.rating || 4.9}</span>
                </div>
                <span className="text-outline text-xs">•</span>
                <span className="font-caption text-caption text-on-surface-variant">
                  ({product.reviewsCount || 128} verified reviews)
                </span>
              </div>

              <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
                {product.name}
              </h2>
            </div>

            <div className="flex items-baseline gap-3 pt-1 border-t border-outline-variant/20">
              <span className="font-headline-lg text-headline-lg text-on-surface font-bold">
                ${(product.price / 100).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="font-body-md text-body-md text-tertiary line-through">
                  ${(product.originalPrice / 100).toFixed(2)}
                </span>
              )}
              <span className="font-caption text-caption text-secondary font-semibold uppercase tracking-wider">
                Complimentary Express Shipping
              </span>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed line-clamp-4">
              {product.description ||
                "Artisan lifestyle goods crafted with understated Scandinavian elegance and sustainable materials for daily life."}
            </p>

            {/* Colors Swatches */}
            <div className="space-y-1.5 pt-1">
              <span className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                Craft Color Options
              </span>
              <div className="flex items-center gap-2">
                {(product.colors || ["#273D33", "#33312E", "#8A5A44"]).map((color, idx) => (
                  <span
                    key={idx}
                    className="w-6 h-6 rounded-full ring-2 ring-outline-variant/40 shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-space-lg space-y-2.5">
            <button
              onClick={() => {
                onAddToCart(product);
              }}
              className="w-full h-12 rounded-full bg-inverse-surface text-inverse-on-surface hover:bg-on-surface font-label-md text-label-md font-bold flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              <span>{currentQty > 0 ? `Add Another (${currentQty} in Bag)` : "Add to Shopping Bag"}</span>
            </button>

            {currentQty > 0 && (
              <button
                onClick={() => {
                  onClose();
                  router.push("/cart");
                }}
                className="w-full h-11 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-bold flex items-center justify-center gap-1.5 shadow-sm hover:bg-secondary/90 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>View Bag &amp; Checkout</span>
              </button>
            )}

            <Link
              href={`/products/${product.id}`}
              className="w-full h-10 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold flex items-center justify-center gap-1 transition-colors border border-outline-variant/30"
              onClick={onClose}
            >
              <span>View Full Specification Page</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
