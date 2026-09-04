"use client";

import Link from "next/link";
import React from "react";

export default function OrderSuccessPage() {
  return (
    <div className="bg-background min-h-screen font-body-md antialiased text-on-surface flex flex-col justify-between">
      {/* Brand Header Navigation */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(45,49,46,0.04)]">
        <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-gutter-desktop">
          <Link href="/" className="flex items-center gap-space-sm flex-shrink-0">
            <img 
              alt="ShopEra Brand Logo" 
              className="h-8 w-auto object-contain" 
              src="/logo.png"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">ShopEra</span>
          </Link>
          <nav className="hidden md:flex items-center gap-space-xl">
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/products">Shop</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/orders">Orders</Link>
          </nav>
        </div>
      </header>

      <main className="w-full pt-32 pb-space-3xl flex-1 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-margin-mobile text-center">
          <div className="p-space-xl lg:p-space-2xl rounded-3xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col items-center gap-space-md">
            <div className="w-20 h-20 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary mb-2 animate-bounce">
              <span className="material-symbols-outlined text-[42px]">task_alt</span>
            </div>
            
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Payment Confirmed</span>
            <h1 className="font-display-xl text-headline-lg text-on-surface font-bold">Thank you for your order!</h1>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Your payment via Razorpay has been processed successfully. We are now preparing your order for express dispatch.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-space-sm pt-space-md w-full">
              <Link
                href="/orders"
                className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-on-surface transition-all shadow-sm flex items-center gap-2"
              >
                <span>View Order History</span>
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </Link>
              <Link
                href="/products"
                className="h-12 px-space-xl rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center gap-2"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-space-lg text-center text-on-surface-variant font-caption text-caption">
        <p>© 2025 ShopEra Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
