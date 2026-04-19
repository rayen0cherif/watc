import Link from "next/link";
import { AlertTriangle, Check, Circle, Loader2, type LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { formatDateShort } from "@/lib/format";
import type { Milestone } from "@/types";

const STATUS_META: Record<
  Milestone["status"],
  { label: string; icon: LucideIcon; tone: string }
> = {
  done: { label: "Terminé", icon: Check, tone: "bg-accent-500 text-white border-accent-500" },
  in_progress: { label: "En cours", icon: Loader2, tone: "bg-primary-500 text-white border-primary-500" },
  blocked: { label: "Bloqué", icon: AlertTriangle, tone: "bg-danger-500 text-white border-danger-500" },
  todo: { label: "À faire", icon: Circle, tone: "bg-white text-neutral-400 border-neutral-200" },
};

export function TimelineCard({ milestones }: { milestones: Milestone[] }) {
  return (
    <Card>
      <CardHeader
        action={
          <Link
            href="/student/pfe"
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            Voir tous les jalons
          </Link>
        }
      >
        <CardTitle>Jalons du projet</CardTitle>
      </CardHeader>

      <ol className="space-y-0">
        {milestones.map((milestone, index) => {
          const meta = STATUS_META[milestone.status];
          const Icon = meta.icon;
          const isLast = index === milestones.length - 1;
          return (
            <li key={milestone.id} className="relative flex gap-4 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  aria-hidden
                  className="absolute left-[15px] top-8 h-full w-px bg-neutral-200"
                />
              ) : null}
              <span
                aria-hidden
                className={cn(
                  "relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                  meta.tone,
                )}
              >
                <Icon
                  className={cn("h-4 w-4", milestone.status === "in_progress" && "animate-spin")}
                  strokeWidth={2}
                />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-neutral-900">{milestone.title}</p>
                  <span className="shrink-0 text-xs text-neutral-600">
                    {formatDateShort(milestone.dueDate)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-neutral-600">{meta.label}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
