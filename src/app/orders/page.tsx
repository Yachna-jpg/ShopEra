"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { apiFetch } from "@/lib/api";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/orders")
      .then((data) => {
        if (data) setOrders(data);
      })
      .catch((e) => {
        if (e.status === 401) {
          router.push("/login");
        } else {
          setError(e.message || "Failed to load orders");
        }
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <LoadingSpinner text="Loading orders..." />;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <EmptyState
          title="You have no orders yet."
          description="Once you purchase something, it will appear here."
          actionLabel="Start Shopping"
          actionHref="/"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between mb-3">
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-medium text-blue-600">{order.status}</span>
              </div>
              <ul className="text-sm text-gray-700 mb-3">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.product.name} × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold">
                Total: ${(order.totalAmount / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
