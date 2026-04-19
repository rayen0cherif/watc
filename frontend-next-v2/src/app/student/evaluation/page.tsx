"use client";

import { useState, useEffect } from "react";
import { Award, BrainCircuit, CheckCircle, Loader2, Star, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { fetchApi } from "@/lib/api";

export default function EvaluationPage() {
  const [evalData, setEvalData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchApi<any>("/ai/evaluation")
      .then((data) => {
        if (data?.profile) setEvalData(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !evalData?.profile) {
    return (
      <div className="mx-auto max-w-[900px] px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <BrainCircuit className="h-12 w-12 text-neutral-300" />
            <h2 className="text-xl font-bold text-neutral-700">Évaluation IA non effectuée</h2>
            <p className="max-w-sm text-neutral-500">Complétez l'évaluation IA en téléversant votre CV pour voir vos résultats ici.</p>
            <a href="/student/ai-evaluation" className="mt-2 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary-600">
              Commencer l'évaluation
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const profile = evalData.profile;
  const questions: any[] = evalData.questions || [];
  const completed: boolean = evalData.completed;

  const skillCount = profile.skills?.length || 0;
  const score = Math.min(20, Math.round(skillCount * 2.5));
  const maxScore = 20;

  return (
    <div className="mx-auto max-w-[900px] px-8 py-8 space-y-6">
      <Card>
        <CardContent className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center gap-6 border-b border-neutral-200 pb-8 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-500">
              <Award className="h-10 w-10" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-1 text-2xl font-bold text-neutral-900">Évaluation IA — Profil Technique</h1>
              <p className="text-neutral-500">Analysé à partir de votre CV par Gemini AI</p>
              {completed ? (
                <Badge variant="success" className="mt-2 gap-1"><CheckCircle className="h-3.5 w-3.5" />Quiz complété</Badge>
              ) : (
                <Badge variant="warning" className="mt-2">Quiz non complété</Badge>
              )}
            </div>
            <div className="min-w-[140px] rounded-xl border border-success-500/30 bg-success-50 px-6 py-4 text-center">
              <p className="mb-1 text-sm font-semibold uppercase text-success-600">Score IA</p>
              <p className="text-3xl font-bold text-success-600">
                {score}<span className="text-xl text-success-500/70">/{maxScore}</span>
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Profile card */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
                <BrainCircuit className="h-5 w-5 text-primary-500" />
                Profil identifié
              </h3>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-xl font-bold text-white">
                    {profile.name?.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-neutral-900">{profile.name}</p>
                    <p className="text-sm font-medium text-primary-500">{profile.role}</p>
                  </div>
                </div>
                <div className="grid gap-3 pt-2 text-sm sm:grid-cols-2">
                  <div>
                    <span className="block font-semibold text-neutral-500 uppercase text-2xs tracking-wider mb-1">Formation</span>
                    <span className="text-neutral-800">{profile.education}</span>
                  </div>
                  <div>
                    <span className="block font-semibold text-neutral-500 uppercase text-2xs tracking-wider mb-1">Expérience phare</span>
                    <span className="text-neutral-800">{profile.experience}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills grid */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
                <Star className="h-5 w-5 text-warning-500" />
                Stack technique validée
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {profile.skills?.map((skill: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3">
                    <div>
                      <p className="text-2xs font-semibold uppercase text-neutral-400">{skill.type}</p>
                      <p className="text-sm font-bold text-neutral-900">{skill.name}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 shrink-0 text-success-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Questions asked */}
            {questions.length > 0 && (
              <div>
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-neutral-900">
                  <FileText className="h-5 w-5 text-primary-500" />
                  Questions du quiz ({questions.length})
                </h3>
                <div className="space-y-3">
                  {questions.map((q: any, i: number) => (
                    <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <Badge variant="primary" className="uppercase tracking-wider text-[10px]">{q.type}</Badge>
                        <Badge variant="warning" className="uppercase tracking-wider text-[10px]">{q.difficulty}</Badge>
                        <span className="ml-auto text-2xs text-neutral-400">{q.estimatedTime}</span>
                      </div>
                      <p className="text-2xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">{q.context}</p>
                      <p className="text-sm font-medium text-neutral-900">{q.question}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
