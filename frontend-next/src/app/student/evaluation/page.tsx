import { Award, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchEvaluations } from "@/lib/api/evaluation";
import { formatDate } from "@/lib/format";
import type { Evaluation } from "@/types";

export default async function StudentEvaluationPage() {
  const evaluations = await fetchEvaluations();
  const midterm = evaluations.find((e) => e.stage === "midterm");
  const final = evaluations.find((e) => e.stage === "final");

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Évaluations
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Synthèse des notations mi-parcours et finale, avec le détail de chaque critère.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EvaluationCard stage="midterm" evaluation={midterm} />
        <EvaluationCard stage="final" evaluation={final} />
      </div>
    </div>
  );
}

function EvaluationCard({
  stage,
  evaluation,
}: {
  stage: "midterm" | "final";
  evaluation?: Evaluation;
}) {
  const stageLabel = stage === "midterm" ? "Évaluation mi-parcours" : "Évaluation finale";
  const badgeTone = stage === "midterm" ? "primary" : "accent";

  if (!evaluation) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Badge tone={badgeTone as never}>{stageLabel}</Badge>
          </div>
          <CardTitle className="mt-2">À venir</CardTitle>
        </CardHeader>
        <EmptyState
          icon={ClipboardList}
          title="Évaluation non encore réalisée"
          description={
            stage === "midterm"
              ? "Vos encadrants compléteront cette évaluation à mi-parcours."
              : "La note finale sera publiée après la soutenance."
          }
        />
      </Card>
    );
  }

  const scorePercent = Math.round((evaluation.overallScore / evaluation.maxScore) * 100);

  return (
    <Card>
      <CardHeader
        action={
          <div className="flex items-center gap-2 rounded-lg bg-accent-50 px-3 py-1.5 text-accent-600">
            <Award className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            <span className="text-sm font-semibold">
              {evaluation.overallScore}/{evaluation.maxScore}
            </span>
          </div>
        }
      >
        <Badge tone={badgeTone as never}>{stageLabel}</Badge>
        <CardTitle className="mt-2">Note globale</CardTitle>
        <p className="mt-1 text-xs text-neutral-600">
          Évalué le {formatDate(evaluation.gradedAt)} par {evaluation.gradedBy}
        </p>
      </CardHeader>

      <Progress value={scorePercent} tone="accent" />

      <div className="mt-6 space-y-4">
        <h4 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Détail par critère
        </h4>
        <ul className="space-y-3">
          {evaluation.criteria.map((criterion) => {
            const percent = Math.round((criterion.score / criterion.max) * 100);
            return (
              <li key={criterion.id}>
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{criterion.label}</p>
                    <p className="mt-0.5 text-xs text-neutral-600">{criterion.description}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-neutral-900">
                    {criterion.score}/{criterion.max}
                  </span>
                </div>
                <Progress value={percent} tone="primary" />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent-500/20 bg-accent-50 p-4">
          <h5 className="text-xs font-medium uppercase tracking-wide text-accent-600">
            Points forts
          </h5>
          <p className="mt-2 text-sm text-neutral-900">{evaluation.strengths}</p>
        </div>
        <div className="rounded-lg border border-warning-500/20 bg-warning-50 p-4">
          <h5 className="text-xs font-medium uppercase tracking-wide text-warning-500">
            Axes d'amélioration
          </h5>
          <p className="mt-2 text-sm text-neutral-900">{evaluation.improvements}</p>
        </div>
      </div>
    </Card>
  );
}
