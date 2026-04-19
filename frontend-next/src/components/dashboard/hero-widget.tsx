import Link from "next/link";
import { ArrowRight, Calendar, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/format";
import type { PFEProject } from "@/types";

interface HeroWidgetProps {
  studentName: string;
  project: PFEProject;
  upcomingMilestoneLabel?: string;
  upcomingMilestoneDate?: string;
}

export function HeroWidget({
  studentName,
  project,
  upcomingMilestoneLabel,
  upcomingMilestoneDate,
}: HeroWidgetProps) {
  const firstName = studentName.split(" ")[0];

  return (
    <section
      aria-labelledby="dashboard-hero-title"
      className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <Badge tone="primary">Projet de Fin d'Études</Badge>
          <h1
            id="dashboard-hero-title"
            className="mt-3 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          >
            Bonjour {firstName}, votre PFE avance bien.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            {project.title}
          </p>

          <div className="mt-5 flex flex-wrap gap-5 text-sm">
            <MetaItem
              icon={<Target className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
              label="Avancement"
              value={`${project.progress}%`}
            />
            <MetaItem
              icon={<Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
              label="Soutenance"
              value={formatDateShort(project.defenseDate)}
            />
            {upcomingMilestoneLabel && upcomingMilestoneDate ? (
              <MetaItem
                icon={<Calendar className="h-4 w-4" strokeWidth={1.5} aria-hidden />}
                label="Prochain jalon"
                value={`${upcomingMilestoneLabel} · ${formatDateShort(upcomingMilestoneDate)}`}
              />
            ) : null}
          </div>
        </div>

        <div className="w-full max-w-sm shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-600">
              Progression globale
            </span>
            <span className="text-2xl font-semibold text-neutral-900">
              {project.progress}%
            </span>
          </div>
          <Progress value={project.progress} tone="primary" />
          <Link
            href="/student/pfe"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Voir le détail du PFE
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-neutral-400">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-neutral-900">{value}</p>
    </div>
  );
}
