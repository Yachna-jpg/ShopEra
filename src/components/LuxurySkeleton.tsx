"use client";

import React from "react";

export default function LuxurySkeleton({
  type = "generic",
}: {
  type?: "cart" | "orders" | "product" | "generic";
}) {
  return (
    <div className="w-full min-h-screen pt-24 pb-20 bg-background text-on-surface antialiased font-body-md">
      <div className="max-w-[1240px] mx-auto px-margin-mobile lg:px-margin-desktop flex flex-col gap-space-lg">
        {/* Top Header Placeholder */}
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 rounded-full bg-surface-container-high/70 animate-pulse"></div>
          <div className="w-64 h-8 rounded-2xl bg-surface-container-high animate-pulse"></div>
        </div>

        {type === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start mt-4">
            <div className="lg:col-span-8 flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-[2rem] bg-surface-container-low border border-outline-variant/30 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-24 rounded-2xl bg-surface-container-high/80 animate-pulse"></div>
                    <div className="flex flex-col gap-2">
                      <div className="w-40 h-5 rounded-lg bg-surface-container-high animate-pulse"></div>
                      <div className="w-24 h-4 rounded-md bg-surface-container-high/60 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-20 h-8 rounded-full bg-surface-container-high animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-4 p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4">
              <div className="w-32 h-6 rounded-lg bg-surface-container-high animate-pulse"></div>
              <div className="w-full h-12 rounded-full bg-surface-container-high/80 animate-pulse"></div>
              <div className="w-full h-14 rounded-full bg-inverse-surface/30 animate-pulse"></div>
            </div>
          </div>
        )}

        {type === "orders" && (
          <div className="flex flex-col gap-4 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-[2rem] bg-surface-container-low border border-outline-variant/30 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high/80 animate-pulse"></div>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-36 h-4 rounded-md bg-surface-container-high animate-pulse"></div>
                      <div className="w-24 h-3 rounded-md bg-surface-container-high/60 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-20 h-7 rounded-full bg-surface-container-high/70 animate-pulse"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-xl bg-surface-container-high/80 animate-pulse"></div>
                  <div className="w-14 h-16 rounded-xl bg-surface-container-high/80 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "product" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start mt-4">
            <div className="lg:col-span-6 w-full aspect-[4/5] rounded-[2.5rem] bg-surface-container-high/80 animate-pulse"></div>
            <div className="lg:col-span-6 flex flex-col gap-4 p-6 rounded-[2.5rem] bg-surface-container-low border border-outline-variant/30">
              <div className="w-24 h-4 rounded-full bg-surface-container-high/60 animate-pulse"></div>
              <div className="w-3/4 h-10 rounded-2xl bg-surface-container-high animate-pulse"></div>
              <div className="w-32 h-8 rounded-xl bg-surface-container-high/80 animate-pulse"></div>
              <div className="w-full h-24 rounded-2xl bg-surface-container-high/50 animate-pulse"></div>
              <div className="w-full h-14 rounded-full bg-inverse-surface/30 animate-pulse mt-4"></div>
            </div>
          </div>
        )}

        {type === "generic" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 flex flex-col gap-3"
              >
                <div className="w-full aspect-[4/5] rounded-xl bg-surface-container-high/80 animate-pulse"></div>
                <div className="w-3/4 h-4 rounded-md bg-surface-container-high animate-pulse"></div>
                <div className="w-1/2 h-4 rounded-md bg-surface-container-high/60 animate-pulse"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
