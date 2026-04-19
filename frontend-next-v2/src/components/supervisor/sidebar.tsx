"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  GraduationCap,
  ClipboardList,
  CalendarRange,
  FileBarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/logo";

const NAV = [
  { href: "/supervisor/dashboard", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/supervisor/students", label: "Étudiants", icon: GraduationCap },
  { href: "/supervisor/evaluations", label: "Évaluations", icon: ClipboardList },
  { href: "/supervisor/meetings", label: "Réunions", icon: CalendarRange },
  { href: "/supervisor/reports", label: "Rapports", icon: FileBarChart2 },
];

export function SupervisorSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState({ name: "", role: "", initials: "" });

  useEffect(() => {
    // Get user profile from local storage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setProfile({
          name: user.fullName || "",
          role: user.role === "ACADEMIC_MENTOR" ? "Encadrant — ENSI" : "Encadrant",
          initials: user.initials || user.fullName?.split(" ").map((n: string) => n[0]).join("") || "?",
        });
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/supervisor/dashboard" aria-label="Mentora — Espace encadrant">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-sm font-medium text-neutral-500">
          Espace encadrant
        </p>
        <ul className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200 ease-in-out",
                    active
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-6 px-3 pb-2 text-sm font-medium text-neutral-500">
          Compte
        </p>
        <ul className="flex flex-col gap-1">
          <li>
            <Link
              href="/supervisor/settings"
              className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-600 transition-all duration-200 ease-in-out hover:bg-neutral-50 hover:text-neutral-900"
            >
              <Settings className="h-4 w-4" strokeWidth={2} />
              Paramètres
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-600 transition-all duration-200 ease-in-out hover:bg-neutral-50 hover:text-neutral-900"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              Déconnexion
            </Link>
          </li>
        </ul>
      </nav>

      <div className="border-t border-neutral-200 p-4">
        <div className="flex items-center gap-3 rounded-lg p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold text-white">
            {profile.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {profile.name}
            </p>
            <p className="truncate text-sm text-neutral-500">
              {profile.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
