"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role, User } from "@/types";
import { mockStudent } from "@/data/mocks";

interface AuthContextValue {
  user: User | null;
  hydrated: boolean;
  login: (role: Role, profile?: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "mentora.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (client-only)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      }
    } catch {
      // ignore corrupted storage
    }
    setHydrated(true);
  }, []);

  const login = useCallback((role: Role, profile: Partial<User> = {}) => {
    // TODO(backend): replace with real authenticated session.
    const base: User =
      role === "student"
        ? { ...mockStudent }
        : {
            id: "sv-001",
            name: profile.name ?? "Dr. Karim Benali",
            email: profile.email ?? "karim.benali@univ.tn",
            role: "supervisor",
          };
    const merged: User = { ...base, ...profile, role };
    setUser(merged);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {
      // ignore storage errors
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }, []);

  const value = useMemo(() => ({ user, hydrated, login, logout }), [user, hydrated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
