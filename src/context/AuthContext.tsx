"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  address?: string | null;
  image?: string | null;
} | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProviderInner({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  
  const user = session?.user ? {
    id: (session.user as any).id,
    name: session.user.name || "",
    email: session.user.email || "",
    role: (session.user as any).role || "CUSTOMER",
    address: (session.user as any).address || null,
    image: (session.user as any).image || null,
  } : null;

  const loading = status === "loading";

  async function refreshUser() {
    await update();
  }

  async function logout() {
    await signOut({ callbackUrl: "/" });
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
