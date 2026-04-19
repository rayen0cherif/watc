import Link from "next/link";
import { ArrowRight, Lightbulb, Sparkles, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AiWidget() {
  return (
    <Card className="border-primary-100 bg-gradient-to-br from-white to-primary-50/60">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white">
          <Sparkles className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <Badge tone="primary">Insights IA</Badge>
          <h3 className="mt-2 text-base font-semibold text-neutral-900">
            Recommandation de la semaine
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            D'après votre journal et vos évaluations, la priorité technique cette
            semaine devrait être la mise en place de tests d'intégration sur votre
            API d'authentification.
          </p>

          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Lightbulb
                className="mt-0.5 h-4 w-4 shrink-0 text-primary-600"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="text-neutral-900">
                Écrivez 3 tests couvrant les cas nominal, erreur et expiration de
                token.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <TrendingUp
                className="mt-0.5 h-4 w-4 shrink-0 text-accent-600"
                strokeWidth={1.5}
                aria-hidden
              />
              <span className="text-neutral-900">
                Progression détectée (+8%) sur vos compétences backend — continuez
                sur cette lancée.
              </span>
            </li>
          </ul>

          <Link
            href="/student/skills"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Voir l'analyse complète
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
          </Link>
        </div>
      </div>
    </Card>
  );
}
