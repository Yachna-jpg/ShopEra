"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryName: string;
};

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  categoryName,
}: ProductCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    gsap.to(cardRef.current, { scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", duration: 0.3, ease: "power2.out" });
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1.1, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, { scale: 1, boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)", duration: 0.3, ease: "power2.out" });
    if (imageRef.current) {
      gsap.to(imageRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    }
  };

  return (
    <Link
      ref={cardRef}
      href={`/products/${id}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white rounded-lg shadow overflow-hidden group product-card block"
      style={{ transformOrigin: "center" }}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            ref={imageRef}
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-1">{categoryName}</p>
        <h2 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h2>
        <p className="text-blue-600 font-bold">${(price / 100).toFixed(2)}</p>
      </div>
    </Link>
  );
}
