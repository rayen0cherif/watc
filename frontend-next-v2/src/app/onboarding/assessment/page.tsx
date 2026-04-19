"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Sparkles, ArrowRight, MessageSquare, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ASSESSMENT_PREVIEW, type AssessmentQuestion } from "@/lib/onboarding-data";
import { cn } from "@/lib/cn";

type Phase = "intro" | "running" | "done";

const TOTAL_SECONDS = 15 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

export default function AssessmentStepPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  const questions = ASSESSMENT_PREVIEW;
  const current = questions[index];
  const total = questions.length;
  const progressPct = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total]
  );

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function next() {
    if (index < total - 1) {
      setIndex(index + 1);
    } else {
      setPhase("done");
    }
  }

  if (phase === "intro") return <IntroView onStart={() => setPhase("running")} />;
  if (phase === "done") return <ResultView onContinue={() => router.push("/student/dashboard")} />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Étape 6 sur 6 · Évaluation IA</p>
          <h1 className="mt-1 text-xl font-semibold text-neutral-900">
            Question {index + 1} sur {total}
          </h1>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900">
          <Clock className="h-4 w-4 text-neutral-500" strokeWidth={2} />
          <span className="tabular-nums">{formatTime(seconds)}</span>
        </div>
      </div>

      <div className="mb-6 h-1 w-full overflow-hidden rounded-lg bg-neutral-200">
        <div
          className="h-full bg-primary-500 transition-all duration-200"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <Card className="p-6">
        <div className="mb-4 flex items-center gap-2">
          <Badge variant="primary" withDot>
            {current.topic}
          </Badge>
          <Badge variant="neutral">
            {current.kind === "qcm" ? "Choix multiple" : "Question ouverte"}
          </Badge>
        </div>

        <p className="text-base font-medium leading-relaxed text-neutral-900">
          {current.prompt}
        </p>

        <div className="mt-6">
          {current.kind === "qcm" ? (
            <QcmOptions
              question={current}
              selected={answers[current.id]}
              onSelect={selectAnswer}
            />
          ) : (
            <Textarea
              rows={6}
              value={answers[current.id] ?? ""}
              onChange={(e) => selectAnswer(e.target.value)}
              placeholder={current.placeholder}
            />
          )}
        </div>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Vos réponses sont enregistrées automatiquement.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={next}
          disabled={!answers[current.id]}
        >
          {index === total - 1 ? "Terminer l'évaluation" : "Question suivante"}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function QcmOptions({
  question,
  selected,
  onSelect,
}: {
  question: Extract<AssessmentQuestion, { kind: "qcm" }>;
  selected: string | undefined;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="grid gap-3">
      {question.options.map((opt) => {
        const active = selected === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all duration-200 ease-in-out hover:-translate-y-px",
              active
                ? "border-primary-500 bg-primary-50/40 text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
            )}
          >
            <span
              aria-hidden
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
                active
                  ? "border-primary-500 bg-primary-500"
                  : "border-neutral-300"
              )}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 6 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Évaluation adaptative générée par l&apos;IA
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          À partir de votre stack et de vos compétences, l&apos;assistant IA
          construit une évaluation calibrée — un mélange de QCM et de questions
          ouvertes ajusté à votre profil.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Stat icon={ListChecks} label="Questions" value={`~${ASSESSMENT_PREVIEW.length}`} hint="adaptatives" />
          <Stat icon={Clock} label="Durée" value="15 min" hint="chronomètre actif" />
          <Stat icon={Sparkles} label="Format" value="QCM + ouvert" hint="généré par l'IA" />
        </div>

        <div className="mt-6 grid gap-3 border-t border-neutral-200 pt-6">
          <Bullet icon={ListChecks}>
            Questions à choix multiple sur les fondamentaux de votre stack.
          </Bullet>
          <Bullet icon={MessageSquare}>
            Questions ouvertes pour évaluer le raisonnement et la prise de
            décision.
          </Bullet>
          <Bullet icon={Sparkles}>
            La difficulté s&apos;adapte à vos réponses précédentes pour cibler
            précisément vos axes de progression.
          </Bullet>
        </div>
      </Card>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
        <p className="text-sm text-neutral-500">
          Vous pouvez interrompre l&apos;évaluation à tout moment ; un brouillon
          sera conservé.
        </p>
        <Button variant="primary" size="md" onClick={onStart}>
          Démarrer l&apos;évaluation
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500">{hint}</p>
    </div>
  );
}

function Bullet({
  icon: Icon,
  children,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
        <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      </div>
      <p className="text-sm text-neutral-700">{children}</p>
    </div>
  );
}

function ResultView({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15 text-accent-700">
        <Sparkles className="h-5 w-5" strokeWidth={2} />
      </div>
      <h1 className="text-[28px] font-semibold leading-tight text-neutral-900">
        Évaluation enregistrée
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Vos réponses ont été transmises. Le rapport détaillé sera disponible
        dans votre tableau de bord dès la finalisation par l&apos;assistant IA.
      </p>

      <Card className="mt-8 p-6 text-left">
        <p className="text-sm font-medium text-neutral-900">Prochaines étapes</p>
        <ul className="mt-3 space-y-2 text-sm text-neutral-600">
          <li>· Vos encadrants reçoivent une notification d&apos;assignation.</li>
          <li>· Le rapport d&apos;évaluation arrivera sous quelques minutes.</li>
          <li>· Votre tableau de bord est prêt à l&apos;emploi.</li>
        </ul>
      </Card>

      <div className="mt-8">
        <Button variant="primary" size="md" onClick={onContinue}>
          Accéder à mon espace
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
