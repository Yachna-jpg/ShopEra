import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    select: { name: true, address: true, email: true },
  });

  return (
    <div className="bg-background min-h-screen font-body-md antialiased text-on-surface flex flex-col">
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
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/cart">Cart</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" href="/orders">Orders</Link>
          </nav>
          <div className="flex items-center gap-space-sm">
            <span className="font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container">
              <span className="material-symbols-outlined text-[16px] text-secondary">shield</span>
              <span>256-Bit Encrypted Checkout</span>
            </span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="w-full pt-28 pb-space-3xl flex-1">
        <div className="max-w-[1280px] mx-auto px-margin-mobile lg:px-margin-desktop">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 font-caption text-caption text-on-surface-variant mb-space-md">
            <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-on-surface transition-colors">Cart</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Secure Checkout</span>
          </div>

          <div className="flex flex-col gap-space-xs mb-space-2xl">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Finalizing Order</span>
            <h1 className="font-display-xl text-display-xl text-on-surface tracking-tight">Express Checkout</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              Confirm your delivery address and complete your purchase securely with Razorpay.
            </p>
          </div>

          <CheckoutClient user={user} />
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-space-lg text-center text-on-surface-variant font-caption text-caption">
        <p>© 2025 ShopEra Inc. All rights reserved. Powered by Razorpay Secure Payments.</p>
      </footer>
    </div>
  );
}
