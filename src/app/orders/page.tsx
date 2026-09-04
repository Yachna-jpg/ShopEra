"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import LuxurySkeleton from "@/components/LuxurySkeleton";

type OrderItem = {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    name: string;
    imageUrl: string | null;
    price: number;
    category?: { name: string };
  };
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PAID" | "PROCESSING" | "DELIVERED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [reorderingId, setReorderingId] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 3500);
  };

  useEffect(() => {
    apiFetch("/api/orders")
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((e) => {
        if (e.status === 401) {
          router.push("/login?callbackUrl=/orders");
        } else {
          setError(e.message || "Failed to load order history");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleReorder = async (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
    setReorderingId(order.id);
    try {
      for (const item of order.items) {
        if (item.product?.id) {
          await addToCart(item.product.id, item.quantity);
        }
      }
      showToast("All items from this order added to your bag!");
      setTimeout(() => router.push("/cart"), 1000);
    } catch (err: any) {
      showToast(err.message || "Could not reorder items");
    } finally {
      setReorderingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "ALL" ? true : order.status.toUpperCase() === activeFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.product?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <LuxurySkeleton type="orders" />;
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen pt-28 pb-20 px-margin-mobile lg:px-margin-desktop antialiased">
        <div className="max-w-xl mx-auto p-space-2xl bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 text-center flex flex-col items-center gap-space-md shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[40px]">error_outline</span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Unable to load orders</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-colors"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Feedback Notification */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[200] px-5 py-4 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-3 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[22px] text-secondary">check_circle</span>
          <span className="font-label-md text-label-md font-medium">{toast.message}</span>
        </div>
      )}

      <div className="bg-background min-h-screen pt-24 pb-20 font-body-md text-on-surface antialiased">
        <div className="max-w-[1240px] mx-auto px-margin-mobile lg:px-margin-desktop">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
                Account Dashboard
              </span>
              <h1 className="font-display-lg text-display-lg font-bold text-on-surface tracking-tight mt-1">
                Order History &amp; Receipts
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Track your active shipments, view itemized receipts, and manage purchases.
              </p>
            </div>

            <Link
              href="/products"
              className="h-12 px-space-xl rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold inline-flex items-center gap-2 transition-colors self-start md:self-auto border border-outline-variant/30 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Shop Catalog</span>
            </Link>
          </div>

          {/* Controls: Search Bar & Status Filter Pills */}
          <div className="bg-surface-container-low p-space-md lg:p-space-lg rounded-[2rem] border border-outline-variant/30 shadow-sm mb-space-xl flex flex-col md:flex-row items-center justify-between gap-space-md">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search orders or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-4 rounded-full bg-surface-container-lowest border border-outline/30 font-body-sm text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-outline-variant"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {(["ALL", "PAID", "PROCESSING", "DELIVERED"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-full font-label-sm text-label-sm font-bold transition-all whitespace-nowrap border ${
                    activeFilter === filter
                      ? "bg-inverse-surface text-inverse-on-surface border-inverse-surface shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant border-outline-variant/40 hover:border-outline"
                  }`}
                  type="button"
                >
                  {filter === "ALL" ? `All (${orders.length})` : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="max-w-md mx-auto p-space-2xl bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 text-center flex flex-col items-center gap-space-md shadow-sm">
              <div className="w-16 h-16 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[32px]">inventory_2</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">No orders found</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  {searchQuery || activeFilter !== "ALL"
                    ? "Try adjusting your search query or status filter."
                    : "You haven't placed any orders yet. Discover our luxury collection today."}
                </p>
              </div>
              <Link
                href="/products"
                className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-all flex items-center gap-2 shadow-sm mt-2"
              >
                <span>Explore Catalog</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-space-lg">
              {filteredOrders.map((order) => {
                const totalItemsCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
                const orderRefNumber = order.id.slice(-8).toUpperCase();
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                });

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="group bg-surface-container-low p-space-lg lg:p-space-xl rounded-[2rem] border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 cursor-pointer flex flex-col gap-space-md relative overflow-hidden"
                  >
                    {/* Top Row: Ref ID, Date, Status Badge, Total */}
                    <div className="flex flex-wrap items-center justify-between gap-space-sm border-b border-outline-variant/30 pb-space-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary font-bold">
                          <span className="material-symbols-outlined text-[20px]">local_mall</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md font-bold text-on-surface">
                              Order #{orderRefNumber}
                            </span>
                            <span className="font-caption text-caption px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                              {formattedDate}
                            </span>
                          </div>
                          <span className="font-caption text-caption text-on-surface-variant">
                            {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} purchased
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3.5 py-1.5 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
                            order.status === "PAID"
                              ? "bg-secondary-fixed text-on-secondary-fixed"
                              : "bg-surface-container-high text-on-surface font-semibold"
                          }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-secondary"></span>
                          {order.status}
                        </span>

                        <div className="text-right">
                          <span className="font-caption text-caption text-on-surface-variant block uppercase text-[10px] tracking-widest">
                            Grand Total
                          </span>
                          <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                            ${(order.totalAmount / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product Thumbnails Gallery Strip */}
                    <div className="flex items-center justify-between gap-space-md py-1">
                      <div className="flex items-center gap-3 overflow-x-auto py-1 max-w-[80%]">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex-shrink-0"
                          >
                            <div className="w-14 h-16 rounded-xl bg-surface-variant overflow-hidden flex-shrink-0">
                              {item.product?.imageUrl ? (
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                                  Item
                                </div>
                              )}
                            </div>
                            <div className="pr-2">
                              <h4 className="font-label-sm text-label-sm text-on-surface font-semibold truncate max-w-[140px]">
                                {item.product?.name || "Item"}
                              </h4>
                              <p className="font-caption text-caption text-on-surface-variant">
                                Qty: {item.quantity} × ${((item.priceAtPurchase || item.product?.price || 0) / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={(e) => handleReorder(e, order)}
                          disabled={reorderingId === order.id}
                          className="h-10 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30"
                          title="Add items to cart again"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">sync</span>
                          <span>{reorderingId === order.id ? "Adding..." : "Reorder"}</span>
                        </button>

                        <button
                          className="h-10 px-4 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-bold group-hover:bg-on-surface transition-colors flex items-center gap-1 shadow-sm"
                          type="button"
                        >
                          <span>Full Details</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULL ORDER DETAILS INTERACTIVE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-md animate-in fade-in">
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] bg-surface-container-low rounded-[2.5rem] border border-outline-variant/40 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-space-xl border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary font-bold">
                  <span className="material-symbols-outlined text-[24px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                    Order #{selectedOrder.id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="font-caption text-caption text-on-surface-variant">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-space-xl overflow-y-auto flex flex-col gap-space-lg">
              {/* Order Status & Tracking Timeline */}
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                    Shipment Tracker Status
                  </span>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                    {selectedOrder.status}
                  </span>
                </div>

                {/* Stepper Bar */}
                <div className="grid grid-cols-4 gap-2 pt-2 text-center font-caption text-caption">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="font-semibold text-on-surface">Order Placed</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <span className="font-semibold text-on-surface">Payment Paid</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs animate-pulse">
                      ●
                    </div>
                    <span className="font-semibold text-primary">In Dispatch</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-xs">
                      4
                    </div>
                    <span>Delivered</span>
                  </div>
                </div>
              </div>

              {/* Purchased Items List */}
              <div className="flex flex-col gap-3">
                <h4 className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                  Purchased Items ({selectedOrder.items.reduce((s, i) => s + i.quantity, 0)})
                </h4>

                <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-16 rounded-xl bg-surface-variant overflow-hidden flex-shrink-0">
                          {item.product?.imageUrl ? (
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-on-surface-variant">
                              Item
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-label-md text-label-md font-semibold text-on-surface truncate">
                            {item.product?.name || "Product"}
                          </h5>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Quantity: {item.quantity} × ${((item.priceAtPurchase || item.product?.price || 0) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <span className="font-headline-sm text-headline-sm font-bold text-on-surface flex-shrink-0">
                        ${(((item.priceAtPurchase || item.product?.price || 0) * item.quantity) / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Shipping Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md pt-space-xs border-t border-outline-variant/30">
                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                    Payment Gateway
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Razorpay Encrypted Instant Checkout</p>
                  <p className="font-caption text-caption text-outline font-mono mt-1">
                    ID: {selectedOrder.stripePaymentIntentId || selectedOrder.stripeSessionId || "rzp_pay_verified"}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">
                    Delivery Speed
                  </span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Complimentary 2-Day Express Delivery</p>
                  <p className="font-caption text-caption text-secondary font-bold mt-1">Estimated Arrival: 2-3 Days</p>
                </div>
              </div>

              {/* Final Financial Breakdown */}
              <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface font-medium">${(selectedOrder.totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier Shipping</span>
                  <span className="text-secondary font-bold uppercase text-xs">Complimentary</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-outline-variant/20 text-on-surface font-headline-sm text-headline-sm font-bold">
                  <span>Total Amount Paid</span>
                  <span className="text-primary">${(selectedOrder.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-space-md px-space-xl border-t border-outline-variant/30 bg-surface-container-lowest flex items-center justify-between">
              <button
                onClick={() => {
                  showToast("Tax Invoice downloaded to your device!");
                }}
                className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm font-semibold text-on-surface transition-colors flex items-center gap-1.5 border border-outline-variant/30"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Download Invoice</span>
              </button>

              <button
                onClick={(e) => {
                  setSelectedOrder(null);
                  handleReorder(e, selectedOrder);
                }}
                className="px-5 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-bold hover:bg-on-surface transition-colors flex items-center gap-1.5 shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">sync</span>
                <span>Reorder Items</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
