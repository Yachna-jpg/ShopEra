"use client";

import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. You will receive a confirmation shortly.
        </p>
        <Link
          href="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
