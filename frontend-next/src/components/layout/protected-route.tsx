"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/providers/auth-provider";
import type { Role } from "@/types";

interface ProtectedRouteProps {
  role: Role;
  children: ReactNode;
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { user, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role !== role) {
      router.replace(user.role === "student" ? "/student/dashboard" : "/login");
    }
  }, [user, hydrated, role, router]);

  if (!hydrated || !user || user.role !== role) {
    return (
      <div
        aria-live="polite"
        className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-600"
      >
        Chargement de votre espace…
      </div>
    );
  }

  return <>{children}</>;
}
