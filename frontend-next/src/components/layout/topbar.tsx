"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider";
import { initials } from "@/lib/format";
import { Breadcrumb } from "./breadcrumb";

export function Topbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-neutral-200 bg-white px-6 lg:px-8">
      <Breadcrumb />

      <div className="flex items-center gap-2">
        <Link
          href="/student/notifications"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-500"
          />
        </Link>

        <div className="ml-2 flex items-center gap-3 border-l border-neutral-200 pl-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
            <p className="text-xs text-neutral-600">
              {user?.role === "student" ? "Étudiant" : "Encadrant"}
            </p>
          </div>
          <Avatar initials={initials(user?.name ?? "ME")} />
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Se déconnecter"
            className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
