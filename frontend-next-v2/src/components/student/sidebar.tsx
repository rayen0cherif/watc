"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Activity,
  CheckCircle,
  Award,
  Briefcase,
  BrainCircuit,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/logo";
import { fetchApi } from "@/lib/api";
import type { StudentProfile } from "@/lib/types";

const NAV = [
  { href: "/student/dashboard", label: "Tableau de bord", icon: LayoutGrid },
  { href: "/student/pfe", label: "Mon PFE", icon: FileText },
  { href: "/student/tracking", label: "Suivi du projet", icon: Activity },
  { href: "/student/evaluation", label: "Évaluation", icon: CheckCircle },
  { href: "/student/ai-evaluation", label: "Évaluation IA", icon: BrainCircuit },
  { href: "/student/opportunities", label: "Opportunités", icon: Briefcase },
];

export function StudentSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<{ fullName: string; initials: string; role: string } | null>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        setProfile({
          fullName: user.fullName,
          initials: user.initials || user.fullName.split(" ").map((n: string) => n[0]).join(""),
          role: user.role === "STUDENT" ? "Étudiant" : user.role === "ACADEMIC_MENTOR" ? "Encadrant" : user.role,
        });
      }
    } catch (e) {
      console.error("Erreur de chargement du profil:", e);
    }
  }, []);

  const displayName = profile?.fullName || "Étudiant";
  const displayInitials = profile?.initials || "?";
  const displayRole = profile?.role || "Étudiant";

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-neutral-200 bg-white">
      <div className="flex h-16 items-center px-6">
        <Link href="/student/dashboard" aria-label="Mentora — Espace étudiant">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-sm font-medium text-neutral-500">
          Espace étudiant
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
              href="/student/settings"
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
            {displayInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-neutral-900">
              {displayName}
            </p>
            <p className="truncate text-sm text-neutral-500">
              {displayRole}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
