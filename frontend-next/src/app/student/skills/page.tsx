import { Compass, Lightbulb, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { fetchSkills } from "@/lib/api/skills";
import { formatDate } from "@/lib/format";
import type { Skill, SkillCategory } from "@/types";

const CATEGORY_LABEL: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Base de données",
  devops: "DevOps",
  methodology: "Méthodologie",
  soft: "Soft skills",
};

export default async function StudentSkillsPage() {
  const skills = await fetchSkills();

  const average = Math.round(
    skills.reduce((sum, skill) => sum + skill.level, 0) / Math.max(1, skills.length),
  );

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Compétences
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Évolution continue évaluée par l'IA, à partir de vos livrables, tâches et retours.
        </p>
      </div>

      {/* Summary bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Score global" value={`${average}%`} description="Moyenne pondérée" icon={<Compass className="h-5 w-5" strokeWidth={1.5} aria-hidden />} tone="primary" />
        <SummaryCard
          label="Compétences suivies"
          value={`${skills.length}`}
          description="Sur l'ensemble des catégories"
          icon={<Lightbulb className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          tone="accent"
        />
        <SummaryCard
          label="Progression moyenne"
          value={`+${Math.round(skills.reduce((s, k) => s + k.trend, 0) / Math.max(1, skills.length))}%`}
          description="Sur les 30 derniers jours"
          icon={<TrendingUp className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
          tone="primary"
        />
      </div>

      {/* Categories */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries(grouped).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{CATEGORY_LABEL[category as SkillCategory] ?? category}</CardTitle>
            </CardHeader>

            <ul className="space-y-5">
              {items.map((skill) => {
                const positive = skill.trend >= 0;
                const TrendIcon = positive ? TrendingUp : TrendingDown;
                return (
                  <li key={skill.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{skill.name}</p>
                        <p className="mt-0.5 text-xs text-neutral-600">
                          Dernière évaluation : {formatDate(skill.lastAssessedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span
                          className={
                            positive
                              ? "flex items-center gap-1 text-xs text-accent-600"
                              : "flex items-center gap-1 text-xs text-danger-500"
                          }
                        >
                          <TrendIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                          {positive ? "+" : ""}
                          {skill.trend}%
                        </span>
                        <span className="font-semibold text-neutral-900">{skill.level}%</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Progress value={skill.level} tone={positive ? "accent" : "primary"} />
                    </div>
                    {skill.recommendation ? (
                      <p className="mt-2 flex items-start gap-2 rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-600">
                        <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
                        <span>{skill.recommendation}</span>
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  description,
  icon,
  tone,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  tone: "primary" | "accent";
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
          <p className="mt-1 text-xs text-neutral-600">{description}</p>
        </div>
        <div
          className={
            tone === "primary"
              ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"
              : "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600"
          }
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
