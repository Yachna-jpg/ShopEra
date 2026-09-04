"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/api";

export default function ProfileModal() {
  const { user, loading } = useAuth();
  const { update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // If the user is logged in but doesn't have an address, pop up the modal
    if (!loading && user) {
      if (!user.address) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
      setName(user.name || "");
      setAddress(user.address || "");
    } else {
      setIsOpen(false);
    }
  }, [user, loading]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !name.trim()) return;

    setIsSaving(true);
    try {
      await apiFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({ name, address }),
      });
      await update({ name, address });
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/50 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-surface w-full max-w-md rounded-[28px] shadow-lg overflow-hidden animate-in zoom-in-95 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
          type="button"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-space-lg flex flex-col gap-space-md">
          <div className="text-center pr-6 pl-6">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Complete Your Profile
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Please provide your shipping address to proceed with orders.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-label-md text-label-md text-on-surface">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 rounded-xl border border-outline px-4 font-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="font-label-md text-label-md text-on-surface">
                Shipping Address
              </label>
              <textarea
                id="address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-24 rounded-xl border border-outline p-4 font-body-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-surface resize-none"
                placeholder="123 Main St, City, Country, ZIP"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-12 px-5 rounded-full text-on-surface-variant font-label-md hover:bg-surface-container transition-colors"
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="h-12 px-6 rounded-full bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? "Saving..." : "Save Details"}
                {!isSaving && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
