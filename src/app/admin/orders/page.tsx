"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiFetch } from "@/lib/api";

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { quantity: number; product: { name: string } }[];
};

const STATUSES = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '' });

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((data) => {
        if (!data.user || data.user.role !== "ADMIN") router.push("/");
      })
      .catch(() => router.push("/"));

    apiFetch("/api/admin/orders")
      .then(setOrders)
      .catch((e) => {
        setToast({ visible: true, message: e.message || "Failed to load orders" });
        setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      })
      .finally(() => setLoading(false));
  }, [router]);

  async function updateStatus(orderId: string, status: string) {
    try {
      await apiFetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      setToast({ visible: true, message: "Order status updated" });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    } catch (e: any) {
      setToast({ visible: true, message: e.message || "Failed to update status" });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  }

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl animate-in fade-in">
          {toast.message}
        </div>
      )}
      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded">Admin</span>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">{order.user.name} ({order.user.email})</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <ul className="text-sm text-gray-700 mb-2">
              {order.items.map((item, i) => (
                <li key={i}>{item.product.name} × {item.quantity}</li>
              ))}
            </ul>
            <p className="font-bold">${(order.totalAmount / 100).toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
