"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const headerInnerRef = useRef<HTMLDivElement>(null);
  const cartBadgeRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "100px top",
      scrub: true,
      animation: gsap.to(headerInnerRef.current, {
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        ease: "none"
      })
    });
  }, { scope: headerRef });

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartCount(prev => prev + 1);
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  useGSAP(() => {
    if (cartCount > 0 && cartBadgeRef.current) {
      gsap.fromTo(
        cartBadgeRef.current,
        { scale: 1.4 },
        { scale: 1, duration: 0.4, ease: "back.out(2)" }
      );
    }
  }, { dependencies: [cartCount] });

  useEffect(() => {
    if (user) {
      fetch("/api/cart")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.items) {
            const count = data.items.reduce(
              (sum: number, item: { quantity: number }) => sum + item.quantity,
              0
            );
            setCartCount(count);
          }
        })
        .catch(() => {});
    } else {
      setCartCount(0);
    }
  }, [user]);

  const handlePointerDown = (e: React.PointerEvent) => {
    gsap.to(e.currentTarget, { scale: 0.95, duration: 0.1 });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  return (
    <header ref={headerRef} className="bg-white shadow sticky top-0 z-50">
      <div ref={headerInnerRef} className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          ShopEra
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:text-base">
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          {user && (
            <>
              <Link href="/cart" className="relative text-gray-600 hover:text-blue-600">
                Cart
                {cartCount > 0 && (
                  <span ref={cartBadgeRef} className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link href="/orders" className="text-gray-600 hover:text-blue-600">
                Orders
              </Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <>
              <Link href="/admin/products" className="text-gray-600 hover:text-blue-600">
                Admin Products
              </Link>
              <Link href="/admin/orders" className="text-gray-600 hover:text-blue-600">
                Admin Orders
              </Link>
            </>
          )}

          {loading ? (
            <span className="text-gray-400">...</span>
          ) : user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 hidden sm:inline">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 block"
                style={{ transformOrigin: "center" }}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
