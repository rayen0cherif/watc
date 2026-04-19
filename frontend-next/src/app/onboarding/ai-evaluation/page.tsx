"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Brain, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { OnboardingShell } from "@/components/layout/onboarding-shell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { fetchAiProfileDraft, fetchAiQuiz, submitAiEvaluation } from "@/lib/api/ai";
import type { AiProfile, AiQuiz } from "@/types";
import { EASE_ENTRANCE } from "@/lib/motion";
import { useAuth } from "@/providers/auth-provider";

type Phase = "loading" | "profile" | "quiz" | "results";

export default function AiEvaluationPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [profile, setProfile] = useState<AiProfile | null>(null);
  const [quiz, setQuiz] = useState<AiQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Loading animation + draft profile
  useEffect(() => {
    if (phase !== "loading") return;
    let cancelled = false;
    const interval = setInterval(() => {
      setLoadingProgress((prev) => (prev >= 95 ? prev : prev + 5));
    }, 120);

    fetchAiProfileDraft()
      .then((draft) => {
        if (cancelled) return;
        setProfile(draft);
        setLoadingProgress(100);
        setTimeout(() => {
          if (!cancelled) setPhase("profile");
        }, 400);
      })
      .catch(() => {
        toast.error("Impossible de charger l'analyse IA.");
      });

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [phase]);

  // Fetch quiz when entering quiz phase
  useEffect(() => {
    if (phase !== "quiz") return;
    fetchAiQuiz().then(setQuiz).catch(() => toast.error("Quiz indisponible."));
  }, [phase]);

  const currentQuestion = useMemo(
    () => quiz?.questions[currentIndex] ?? null,
    [quiz, currentIndex],
  );

  const selectAnswer = (answerId: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const goNext = async () => {
    if (!quiz || !currentQuestion) return;
    const last = currentIndex === quiz.questions.length - 1;
    if (!last) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitAiEvaluation({ answers });
      setScore(result.score);
      setPhase("results");
    } catch {
      toast.error("Erreur lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  const finalizeOnboarding = () => {
    if (user) {
      login(user.role, { ...user, onboardingComplete: true });
    }
    toast.success("Bienvenue. Votre espace de travail est prêt.");
    router.push("/student/dashboard");
  };

  return (
    <OnboardingShell
      title="Évaluation IA initiale"
      description="Gemini analyse votre profil pour personnaliser le suivi de vos compétences."
    >
      <AnimatePresence mode="wait">
        {phase === "loading" ? (
          <LoadingPhase key="loading" progress={loadingProgress} />
        ) : null}

        {phase === "profile" && profile ? (
          <ProfilePhase
            key="profile"
            profile={profile}
            onStart={() => setPhase("quiz")}
          />
        ) : null}

        {phase === "quiz" && quiz && currentQuestion ? (
          <QuizPhase
            key="quiz"
            quiz={quiz}
            index={currentIndex}
            question={currentQuestion}
            selected={answers[currentQuestion.id]}
            onSelect={selectAnswer}
            onNext={goNext}
            submitting={submitting}
          />
        ) : null}

        {phase === "results" && score !== null ? (
          <ResultsPhase key="results" score={score} onContinue={finalizeOnboarding} />
        ) : null}
      </AnimatePresence>
    </OnboardingShell>
  );
}

function LoadingPhase({ progress }: { progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_ENTRANCE }}
      className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-10 text-center shadow-sm"
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <Sparkles className="h-7 w-7" strokeWidth={1.5} aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-neutral-900">
        Analyse de votre profil
      </h2>
      <p className="mt-2 text-sm text-neutral-600">
        Nous croisons votre sujet de PFE avec une base de référentiels pour
        préparer un test sur-mesure.
      </p>
      <div className="mt-8">
        <Progress value={progress} tone="primary" />
        <p className="mt-2 text-xs font-medium text-neutral-600" aria-live="polite">
          {progress < 100 ? "Analyse en cours…" : "Analyse terminée."}
        </p>
      </div>
    </motion.div>
  );
}

function ProfilePhase({
  profile,
  onStart,
}: {
  profile: AiProfile;
  onStart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_ENTRANCE }}
      className="mx-auto max-w-2xl"
    >
      <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <Brain className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Aperçu du profil détecté
            </p>
            <h2 className="text-lg font-semibold text-neutral-900">
              {profile.headline}
            </h2>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-neutral-600">
          {profile.summary}
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Forces identifiées
            </p>
            <ul className="mt-3 space-y-2">
              {profile.strengths.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-900">
                  <CheckCircle2
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent-600"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Axes à consolider
            </p>
            <ul className="mt-3 space-y-2">
              {profile.gaps.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-900">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-warning-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" size="lg" onClick={onStart}>
          Démarrer le test technique
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </motion.div>
  );
}

function QuizPhase({
  quiz,
  index,
  question,
  selected,
  onSelect,
  onNext,
  submitting,
}: {
  quiz: AiQuiz;
  index: number;
  question: AiQuiz["questions"][number];
  selected?: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  submitting: boolean;
}) {
  const isLast = index === quiz.questions.length - 1;
  const progress = Math.round(((index + (selected ? 1 : 0)) / quiz.questions.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_ENTRANCE }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-5 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-600">
        <span>Question {index + 1} / {quiz.questions.length}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} tone="primary" />

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Badge tone="primary">{question.topic}</Badge>
          <Badge tone="neutral">Niveau {question.difficulty}</Badge>
        </div>
        <h2 className="mt-4 text-lg font-semibold leading-snug text-neutral-900">
          {question.prompt}
        </h2>

        <ul className="mt-6 space-y-3" role="radiogroup" aria-label="Réponses proposées">
          {question.options.map((option) => {
            const active = selected === option.id;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onSelect(option.id)}
                  className={
                    active
                      ? "flex w-full items-start gap-3 rounded-lg border border-primary-500 bg-primary-50 px-4 py-3 text-left text-sm text-neutral-900 ring-2 ring-primary-500/20 transition"
                      : "flex w-full items-start gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left text-sm text-neutral-900 transition hover:border-primary-500/40 hover:bg-neutral-50"
                  }
                >
                  <span
                    aria-hidden
                    className={
                      active
                        ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-primary-500 bg-primary-500 text-white"
                        : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-neutral-200 bg-white"
                    }
                  >
                    {active ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                  </span>
                  <span className="font-medium">{option.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          loading={submitting}
          onClick={onNext}
        >
          {isLast ? "Terminer l'évaluation" : "Question suivante"}
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>
    </motion.div>
  );
}

function ResultsPhase({ score, onContinue }: { score: number; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: EASE_ENTRANCE }}
      className="mx-auto max-w-xl rounded-xl border border-neutral-200 bg-white p-10 text-center shadow-sm"
    >
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent-50 text-accent-600">
        <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} aria-hidden />
      </div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
        Score initial
      </p>
      <p className="mt-1 text-4xl font-semibold text-neutral-900">{score}/100</p>
      <p className="mx-auto mt-4 max-w-md text-sm text-neutral-600">
        Votre baseline est enregistrée. Elle servira de référence à l'évaluation
        continue tout au long de votre PFE.
      </p>
      <Button variant="primary" size="lg" onClick={onContinue} className="mt-8">
        Accéder à mon tableau de bord
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </motion.div>
  );
}
