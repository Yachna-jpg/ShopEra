"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutClient({ user }: { user: any }) {
  const { cart, isLoading, fetchCart } = useCart();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || user?.address || "");
  const [apartment, setApartment] = useState(user?.apartment || "");
  const [city, setCity] = useState(user?.city || "");
  const [state, setState] = useState(user?.state || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [country, setCountry] = useState(user?.country || "India");

  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "error" });
  const router = useRouter();

  useEffect(() => {
    fetchCart();
    // Dynamically load Razorpay SDK script
    if (typeof window !== "undefined" && !(window as any).Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    // Fetch latest user profile details if available
    apiFetch("/api/user/profile")
      .then((res: any) => {
        if (res?.user) {
          const u = res.user;
          if (u.name) setName(u.name);
          if (u.phone) setPhone(u.phone);
          if (u.streetAddress) setStreetAddress(u.streetAddress);
          else if (u.address) setStreetAddress(u.address);
          if (u.apartment) setApartment(u.apartment);
          if (u.city) setCity(u.city);
          if (u.state) setState(u.state);
          if (u.postalCode) setPostalCode(u.postalCode);
          if (u.country) setCountry(u.country);
        }
      })
      .catch(() => {});
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = 0; // Free express shipping
  const grandTotal = subtotal + shippingFee;

  const showToast = (msg: string, type = "error") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "error" }), 4000);
  };

  const handleRazorpayPayment = async () => {
    if (!name.trim()) {
      showToast("Please enter your full name.");
      return;
    }
    if (!streetAddress.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      showToast("Please complete your delivery address (Street, City, State, PIN).");
      return;
    }
    if (!phone.trim()) {
      showToast("Please enter a contact phone number for delivery updates.");
      return;
    }

    const parts = [
      streetAddress.trim(),
      apartment.trim() ? `Apt/Suite: ${apartment.trim()}` : null,
      city.trim(),
      `${state.trim()} - ${postalCode.trim()}`,
      country.trim() || "India"
    ].filter(Boolean);
    const fullFormattedAddress = parts.join(", ");

    setCheckingOut(true);
    try {
      // 1. Save user detailed address
      setSaving(true);
      await apiFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          streetAddress: streetAddress.trim(),
          apartment: apartment.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          country: country.trim() || "India",
          address: fullFormattedAddress,
        }),
      });
      setSaving(false);

      // 2. Call backend Razorpay order creation endpoint
      const orderData = await apiFetch("/api/checkout", { method: "POST" });
      
      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to initialize checkout session.");
      }

      const rzpKey = orderData.key || "rzp_test_TXb50snFJ94NcO";

      // 3. Always open official Razorpay Checkout Modal
      const options: any = {
        key: rzpKey,
        amount: orderData.amount || grandTotal,
        currency: orderData.currency || "INR",
        name: "ShopEra Luxury Store",
        description: "Order Payment Checkout",
        image: "/logo.png",
        prefill: {
          name: name || user?.name || "",
          email: user?.email || "",
          contact: phone || "9876543210",
        },
        theme: {
          color: "#273D33",
        },
        handler: async function (response: any) {
          try {
            setCheckingOut(true);
            const verifyRes = await apiFetch("/api/checkout/verify", {
              method: "POST",
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id || `pay_rzp_${Date.now()}`,
                razorpay_order_id: response.razorpay_order_id || orderData.orderId,
                razorpay_signature: response.razorpay_signature || "verified_sig",
                shippingName: name.trim(),
                shippingPhone: phone.trim(),
                shippingAddress: fullFormattedAddress,
              }),
            });

            if (verifyRes.success) {
              showToast("Payment Successful! Redirecting...", "success");
              setTimeout(() => {
                router.push(`/order/success?orderId=${verifyRes.orderId}`);
              }, 800);
            } else {
              throw new Error(verifyRes.error || "Payment verification failed");
            }
          } catch (err: any) {
            showToast(err.message || "Failed to verify payment.");
            setCheckingOut(false);
          }
        },
        modal: {
          ondismiss: function () {
            setCheckingOut(false);
            showToast("Payment cancelled", "info");
          },
        },
      };

      // Only pass order_id if it's a real order created on Razorpay servers
      if (orderData.orderId && !orderData.orderId.startsWith("order_demo")) {
        options.order_id = orderData.orderId;
      }

      const openModal = () => {
        try {
          const rzp = new (window as any).Razorpay(options);
          rzp.on("payment.failed", function (response: any) {
            showToast(response.error?.description || "Payment failed", "error");
            setCheckingOut(false);
          });
          rzp.open();
        } catch (e: any) {
          console.error("Razorpay open error:", e);
          showToast(e.message || "Could not open Razorpay checkout.");
          setCheckingOut(false);
        }
      };

      if (typeof (window as any).Razorpay !== "undefined") {
        openModal();
      } else {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = openModal;
        script.onerror = () => {
          showToast("Failed to load Razorpay SDK.");
          setCheckingOut(false);
        };
        document.body.appendChild(script);
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      showToast(err.message || "An error occurred during checkout payment.");
      setCheckingOut(false);
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-label-md text-label-md text-on-surface-variant">Preparing your checkout details...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center p-space-xl bg-surface-container-low rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col items-center gap-space-md">
        <div className="w-16 h-16 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">Your bag is currently empty</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Explore our latest arrivals to add items before checking out.</p>
        </div>
        <Link
          href="/products"
          className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-on-surface transition-all shadow-sm flex items-center gap-2"
        >
          <span>Explore Shop</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Toast notification card */}
      {toast.visible && (
        <div className={`fixed bottom-6 right-6 z-[150] px-5 py-4 rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-3 border ${
          toast.type === "success" 
            ? "bg-secondary text-on-secondary border-secondary/40" 
            : toast.type === "info"
            ? "bg-surface-container-high text-on-surface border-outline-variant"
            : "bg-inverse-surface text-inverse-on-surface border-outline-variant/30"
        }`}>
          <span className="material-symbols-outlined text-[22px]">
            {toast.type === "success" ? "check_circle" : toast.type === "info" ? "info" : "warning"}
          </span>
          <span className="font-label-md text-label-md font-medium">{toast.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
        {/* Left Column: Shipping & Delivery Form Card */}
        <div className="lg:col-span-7 flex flex-col gap-space-lg">
          <div className="bg-surface-container-low p-space-xl lg:p-space-2xl rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Shipping Address</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Where should we deliver your order?</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-surface-container text-on-surface-variant">Step 1 of 2</span>
            </div>

            <div className="flex flex-col gap-space-md pt-2">
              {/* Full Name & Phone Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="e.g. Julian Vane"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Flat / House No. &amp; Street Address *</label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                  placeholder="123 Park Avenue, MG Road"
                />
              </div>

              {/* Apartment, Suite, Floor (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Apartment, Suite, Floor <span className="text-outline font-normal lowercase">(optional)</span></label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                  placeholder="Apt 4B, 2nd Floor"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="Bengaluru"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="Karnataka"
                  />
                </div>
              </div>

              {/* Postal Code & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Postal / PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="560038"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold uppercase tracking-wider">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-12 rounded-2xl bg-surface-container-lowest border border-outline/40 px-4 font-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline-variant"
                    placeholder="India"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Shipping Option Card */}
            <div className="mt-2 p-4 rounded-2xl bg-primary-fixed/20 border border-primary-fixed/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <div>
                  <p className="font-label-md text-label-md text-on-surface font-bold">Complimentary Express Courier</p>
                  <p className="font-caption text-caption text-on-surface-variant">Estimated arrival in 2-3 business days</p>
                </div>
              </div>
              <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-primary text-on-primary font-bold">FREE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Razorpay Card */}
        <div className="lg:col-span-5 flex flex-col gap-space-lg">
          <div className="bg-surface-container-low p-space-xl lg:p-space-2xl rounded-3xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-md sticky top-24">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-md">
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Order Summary</h2>
              <span className="font-caption text-caption text-on-surface-variant">{items.length} {items.length === 1 ? "item" : "items"}</span>
            </div>

            {/* Itemized List */}
            <div className="flex flex-col gap-3 max-h-[280px] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="p-3 rounded-2xl bg-surface-container-lowest flex items-center gap-3 border border-outline-variant/20">
                  <div className="w-14 h-16 rounded-xl bg-surface-variant overflow-hidden flex-shrink-0">
                    {item.product.imageUrl ? (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">Item</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-label-md text-on-surface font-semibold truncate">{item.product.name}</h4>
                    <p className="font-caption text-caption text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    ${((item.product.price * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="flex flex-col gap-2 pt-space-xs border-t border-outline-variant/30 font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-on-surface font-medium">${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Express Shipping</span>
                <span className="text-secondary font-medium uppercase text-xs">Complimentary</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Estimated Tax</span>
                <span className="text-on-surface font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 text-on-surface font-headline-sm text-headline-sm font-bold">
                <span>Total Due</span>
                <span className="text-primary">${(grandTotal / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Beautiful Razorpay Card Badge */}
            <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/40 flex flex-col gap-3 mt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">Razorpay Secure Checkout</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed uppercase tracking-wider">Instant UPI &amp; Cards</span>
              </div>
              <p className="font-caption text-caption text-on-surface-variant leading-tight">
                Supports UPI (Google Pay, PhonePe, Paytm), Credit &amp; Debit Cards, NetBanking, and EMI wallets via 256-bit encrypted Razorpay gateway.
              </p>
              <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20">
                <span className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest">Accepted:</span>
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold">GPay</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold">PhonePe</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold">Cards</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high font-semibold">NetBanking</span>
                </div>
              </div>
            </div>

            {/* Primary Payment CTA Button */}
            <button
              onClick={handleRazorpayPayment}
              disabled={checkingOut || saving}
              className="w-full h-14 mt-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-all transform hover:scale-[1.01] shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              type="button"
            >
              {checkingOut || saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-inverse-on-surface border-t-transparent rounded-full animate-spin"></div>
                  <span>Securing Payment...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px] text-secondary">lock</span>
                  <span>Pay ${(grandTotal / 100).toFixed(2)} with Razorpay</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
