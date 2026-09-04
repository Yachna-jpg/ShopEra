"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { cartCount } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_1px_8px_rgba(45,49,46,0.04)]">
      <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-gutter-desktop">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-space-sm flex-shrink-0 group">
          <img
            alt="ShopEra Brand Logo"
            className="h-35 w-45 object-contain transition-transform group-hover:scale-105"
            src="/logo.png"
          />

        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-xl font-label-md text-label-md">
          <Link
            href="/"
            className={`transition-colors ${isActive("/") ? "text-on-surface font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
              }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`transition-colors inline-flex items-center gap-1.5 ${isActive("/products") || pathname.startsWith("/products/")
              ? "text-on-surface font-bold border-b-2 border-primary pb-1"
              : "text-on-surface-variant hover:text-on-surface font-medium"
              }`}
          >
            <span>Shop Catalog</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold uppercase tracking-wider">
              Explore
            </span>
          </Link>
          {user && (
            <>
              <Link
                href="/cart"
                className={`transition-colors ${isActive("/cart") ? "text-on-surface font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                Cart
              </Link>
              <Link
                href="/orders"
                className={`transition-colors ${isActive("/orders") ? "text-on-surface font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                Orders
              </Link>
              <Link
                href="/profile"
                className={`transition-colors ${isActive("/profile") ? "text-on-surface font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                  }`}
              >
                My Profile
              </Link>
            </>
          )}
          {user?.role === "ADMIN" && (
            <Link
              href="/admin/products"
              className={`transition-colors ${isActive("/admin/products") ? "text-on-surface font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-on-surface"
                }`}
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Action Icons & User Control */}
        <div className="flex items-center gap-space-xs sm:gap-space-sm flex-shrink-0">
          <Link
            aria-label="Shop Catalog"
            href="/products"
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">storefront</span>
          </Link>

          <Link
            aria-label="Shopping Bag"
            href="/cart"
            className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-secondary text-on-secondary rounded-full font-caption text-caption font-bold flex items-center justify-center animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse"></div>
          ) : user ? (
            <div className="flex items-center ml-2 gap-3">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-85 transition-opacity" title="Manage Profile & Address">
                {(user as any).image ? (
                  <img
                    src={(user as any).image}
                    alt={user.name || "Avatar"}
                    className="w-8 h-8 rounded-full border border-outline object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="hidden sm:inline font-label-md text-label-md text-on-surface font-semibold">
                  Hi, {user.name}
                </span>
              </Link>
              <button
                onClick={logout}
                className="font-label-sm text-label-sm font-semibold text-secondary hover:underline ml-1"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="font-label-md text-label-md text-on-surface hover:text-primary font-semibold px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold hover:bg-on-surface transition-colors shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
