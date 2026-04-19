"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
  student: "Espace étudiant",
  dashboard: "Tableau de bord",
  pfe: "Mon PFE",
  tracking: "Suivi du projet",
  evaluation: "Évaluations",
  skills: "Compétences",
  opportunities: "Opportunités",
  notifications: "Notifications",
  settings: "Paramètres",
};

export function Breadcrumb() {
  const pathname = usePathname() ?? "";
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Fil d'Ariane" className="hidden items-center gap-1.5 text-sm md:flex">
      {segments.map((segment, index) => {
        const label = LABELS[segment] ?? segment;
        const isLast = index === segments.length - 1;
        return (
          <div key={segment} className="flex items-center gap-1.5">
            <span
              className={
                isLast
                  ? "font-medium text-neutral-900"
                  : "text-neutral-600"
              }
            >
              {label}
            </span>
            {!isLast ? (
              <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden strokeWidth={1.5} />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
