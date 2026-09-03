"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      container.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
  }, { scope: container });

  return (
    <div ref={container} className="text-center py-16">
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{title}</h2>
      {description && (
        <p className="text-gray-500 mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
