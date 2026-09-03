"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const templateRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      templateRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, { scope: templateRef });

  return (
    <div ref={templateRef} className="will-change-transform">
      {children}
    </div>
  );
}
