"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Award,
  BookOpen,
  Briefcase,
  Compass,
  LayoutDashboard,
  Bell,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const studentNav: NavItem[] = [
  { href: "/student/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/student/pfe", label: "Mon PFE", icon: BookOpen },
  { href: "/student/tracking", label: "Suivi du projet", icon: Activity },
  { href: "/student/evaluation", label: "Évaluations", icon: Award },
  { href: "/student/skills", label: "Compétences", icon: Compass },
  { href: "/student/opportunities", label: "Opportunités", icon: Briefcase },
  { href: "/student/notifications", label: "Notifications", icon: Bell },
  { href: "/student/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-neutral-200 bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-neutral-200 px-5">
        <Link href="/student/dashboard" aria-label="Retour au tableau de bord">
          <Logo />
        </Link>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {studentNav.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary-50 text-primary-600"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", active ? "text-primary-500" : "text-neutral-400")}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
