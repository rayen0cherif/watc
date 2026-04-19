"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  FileText,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code,
  Database,
  Server,
  Award,
  Target,
  ArrowRight,
  Clock,
  Shield,
  Star,
  Briefcase,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fetchApi, uploadFileApi } from "@/lib/api";

const ICON_MAP: Record<string, React.ElementType> = {
  Server,
  Database,
  Code,
  Shield,
};

function QuestionCountdown({ estimatedTime, questionKey }: { estimatedTime: string, questionKey: number }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const minutesMatch = estimatedTime.match(/(\d+)/);
    const initialMinutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 5;
    const total = initialMinutes * 60;
    setTotalSeconds(total);
    setTimeLeft(total);

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [questionKey, estimatedTime]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  const progressPercent = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  
  const isUrgent = timeLeft > 0 && timeLeft < 60;
  const isFinished = timeLeft === 0;

  return (
    <div className={cn("ml-auto flex items-center gap-2", isUrgent ? "text-danger-500" : isFinished ? "text-danger-700" : "text-neutral-500")}>
      <div className="relative flex h-6 w-6 items-center justify-center">
        <svg className="-rotate-90 h-full w-full" viewBox="0 0 36 36">
          {/* Background */}
          <path
            className="fill-none stroke-current opacity-20"
            strokeWidth="3"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress */}
          <motion.path
            className="fill-none stroke-current"
            strokeWidth="3"
            strokeDasharray={`${progressPercent}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
      </div>
      <span className="text-sm font-bold font-mono tracking-wider tabular-nums">{formatted}</span>
    </div>
  );
}

export default function AIEvaluationPage() {
  const [view, setView] = useState<"upload" | "loading" | "profile" | "quiz" | "results">("upload");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  
  const [aiProfile, setAiProfile] = useState<any>(null);
  const [aiQuestions, setAiQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchApi<any>("/ai/evaluation")
      .then((res) => {
        if (res.profile && res.questions) {
          setAiProfile(res.profile);
          setAiQuestions(res.questions);
          setView(res.completed ? "results" : "profile");
        }
      })
      .catch((e) => console.log("No previous evaluation", e.message));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMsg("Le fichier ne doit pas dépasser 10 MB.");
        return;
      }
      setErrorMsg(null);
      setFile(selected);
    }
  };

  const startAnalysis = async () => {
    if (!file) return;
    setView("loading");
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("cv", file);
      // TODO: Replace with actual project generic if possible
      formData.append("projectInfo", "Titre du projet actuel: Système PFE. Domaine: Fullstack Web");

      const response = await uploadFileApi<{ data: string }>("/ai/evaluation/generate-quiz", formData);
      
      const parsedData = JSON.parse(response.data);
      
      if (parsedData.profile && parsedData.questions) {
        setAiProfile(parsedData.profile);
        setAiQuestions(parsedData.questions);
        setView("profile");
      } else {
        throw new Error("Invalid output format returned by AI");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg("Erreur lors de l'analyse du CV par l'IA: " + error.message);
      setView("upload");
    }
  };

  const completeEvaluation = async () => {
    try {
      await fetchApi("/ai/evaluation/complete", {
        method: "POST",
        body: JSON.stringify({ answers }),
      });
    } catch (error) {
      console.error("Failed to save completion status", error);
    }
    setView("results");
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/student/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 transition-colors hover:bg-neutral-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </Link>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary-500" />
              <span className="text-lg font-bold">
                Espace Étudiant | Évaluation IA
              </span>
            </div>
          </div>
          <Badge variant="primary" className="gap-2">
            <Target className="h-4 w-4" />
            Test sur-mesure
          </Badge>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6 py-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 0: UPLOAD */}
          {view === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-2xl py-12 text-center"
            >
              <div className="mb-8 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50">
                  <UploadCloud className="h-10 w-10 text-primary-500" />
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold">Déposez votre CV</h1>
              <p className="mx-auto mb-10 max-w-md text-neutral-500">
                Téléchargez votre CV au format PDF. Notre intelligence artificielle l'analysera pour générer une simulation de soutenance basée exactement sur vos expériences et vos compétences.
              </p>

              {errorMsg && (
                <div className="mb-8 rounded-lg bg-red-50 p-4 font-medium text-red-600">
                  {errorMsg}
                </div>
              )}

              <div 
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all",
                  file ? "border-primary-500 bg-primary-50" : "border-neutral-300 hover:border-primary-400 hover:bg-neutral-100"
                )}
              >
                <input 
                  type="file" 
                  accept="application/pdf"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <>
                    <FileText className="mb-4 h-12 w-12 text-primary-500" />
                    <span className="text-lg font-bold text-primary-800">{file.name}</span>
                    <span className="mt-1 text-sm text-primary-600">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </>
                ) : (
                  <>
                    <FileText className="mb-4 h-10 w-10 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-600">Cliquez pour parcourir (Fichier PDF)</span>
                  </>
                )}
              </div>

              <div className="mt-10">
                <Button 
                  variant="primary" 
                  className="px-8 py-6 text-lg shadow-xl shadow-primary-500/20"
                  disabled={!file}
                  onClick={startAnalysis}
                >
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  Analyser mon profil avec l'IA
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 1: LOADING */}
          {view === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: "linear",
                  }}
                  className="h-24 w-24 rounded-full border-r-2 border-t-2 border-primary-500 border-r-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <BrainCircuit className="h-10 w-10 text-primary-500" />
                </div>
              </div>
              <h2 className="mb-3 text-2xl font-bold">
                L'IA analyse votre CV...
              </h2>
              <p className="max-w-md text-center text-neutral-500">
                Extraction des compétences, de l'expérience et des projets
                pour générer un test technique parfaitement adapté à votre
                profil.
              </p>
              <div className="mt-10 flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
                <span className="text-sm font-medium text-neutral-400">Génération du Quiz en cours...</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PROFILE */}
          {view === "profile" && aiProfile && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="grid gap-8 lg:grid-cols-5"
            >
              {/* Left: CV Context */}
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <h1 className="mb-2 text-2xl font-bold">Profil identifié</h1>
                  <p className="text-sm text-neutral-500">
                    Les informations suivantes ont été extraites de votre fichier{" "}
                    <code className="rounded bg-neutral-100 px-1 py-0.5 text-neutral-800">
                      {file?.name || "CV.pdf"}
                    </code>
                    .
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="mb-6 flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-xl font-bold text-white shadow-inner">
                        {aiProfile.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">
                          {aiProfile.name}
                        </h2>
                        <p className="text-sm font-medium text-primary-500">
                          {aiProfile.role}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 text-sm">
                      <div className="flex gap-3">
                        <Briefcase className="h-5 w-5 shrink-0 text-neutral-400" />
                        <div>
                          <span className="block font-semibold text-neutral-800">
                            Expérience Phare
                          </span>
                          <span className="leading-relaxed text-neutral-600">
                            {aiProfile.experience}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Award className="h-5 w-5 shrink-0 text-neutral-400" />
                        <div>
                          <span className="block font-semibold text-neutral-800">
                            Formation & Certifications
                          </span>
                          <span className="block text-neutral-600">
                            {aiProfile.education}
                          </span>
                          {aiProfile.certifications && aiProfile.certifications.length > 0 && (
                            <span className="mt-1 block text-xs text-neutral-500">
                              Inclut{" "}
                              {aiProfile.certifications.length}{" "}
                              certifications (ex:{" "}
                              {aiProfile.certifications[0]})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="mb-4 flex items-center gap-2 font-bold">
                      <Star className="h-4 w-4 text-warning-500" />
                      Stack Technique Majeure
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {aiProfile.skills.map((skill: any, idx: number) => {
                        const SkillIcon = ICON_MAP[skill.icon] || Code;
                        return (
                          <div
                            key={idx}
                            className="rounded-lg border border-neutral-100 bg-neutral-50 p-3"
                          >
                            <SkillIcon className="mb-2 h-5 w-5 text-primary-500" />
                            <span className="block text-xs font-semibold text-neutral-500">
                              {skill.type}
                            </span>
                            <span className="block text-sm font-bold text-neutral-800">
                              {skill.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: CTA */}
              <div className="lg:col-span-3">
                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-primary-900 p-8 text-white shadow-xl shadow-primary-500/20">
                  {/* Decorative */}
                  <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white/5 blur-2xl" />
                  <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/3 rounded-full bg-accent-500/20 blur-2xl" />

                  <div className="relative z-10 flex flex-1 flex-col">
                    <div className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
                      <BrainCircuit className="h-4 w-4 text-accent-400" />
                      Test généré avec succès
                    </div>

                    <h2 className="mb-4 text-3xl font-bold leading-tight">
                      Votre évaluation technique est prête.
                    </h2>

                    <p className="mb-8 max-w-lg text-lg leading-relaxed text-primary-100">
                      Nous avons analysé votre PDF et préparé le questionnaire contenant{" "}
                      <strong>{aiQuestions.length} questions</strong>{" "}
                      spécifiques à l'expérience mentionnée !
                    </p>

                    <div className="mb-auto space-y-4">
                      {aiQuestions.slice(0,3).map((q: any, i: number) => (
                         <div key={i} className="flex items-center gap-3">
                           <CheckCircle2 className="h-5 w-5 text-accent-400" />
                           <span className="truncate">{q.context}</span>
                         </div>
                      ))}
                    </div>

                    <div className="mt-10">
                      <button
                        onClick={() => setView("quiz")}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-bold text-primary-900 shadow-lg transition-all hover:scale-[1.02] hover:bg-neutral-50 sm:w-auto"
                      >
                        Commencer l'évaluation
                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: QUIZ */}
          {view === "quiz" && aiQuestions.length > 0 && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-8">
                <div className="mb-2 flex items-center justify-between text-sm font-medium">
                  <span className="text-neutral-500">
                    Question {activeQuestion + 1} sur {aiQuestions.length}
                  </span>
                  <span className="text-primary-500">
                    {Math.round(
                      ((activeQuestion + 1) / aiQuestions.length) * 100
                    )}
                    % Complété
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <motion.div
                    initial={{
                      width: `${
                        (activeQuestion / aiQuestions.length) * 100
                      }%`,
                    }}
                    animate={{
                      width: `${
                        ((activeQuestion + 1) / aiQuestions.length) * 100
                      }%`,
                    }}
                    className="h-full bg-primary-500 transition-all duration-500 ease-out"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className="p-8 md:p-12">
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                      <Badge variant="primary" className="uppercase tracking-wider">
                        {aiQuestions[activeQuestion].type}
                      </Badge>
                      <Badge variant="warning" className="uppercase tracking-wider">
                        {aiQuestions[activeQuestion].difficulty}
                      </Badge>
                      <QuestionCountdown 
                        estimatedTime={aiQuestions[activeQuestion].estimatedTime} 
                        questionKey={activeQuestion} 
                      />
                    </div>

                    <div className="mb-8">
                      <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-500">
                        <FileText className="h-4 w-4" />
                        {aiQuestions[activeQuestion].context}
                      </p>
                      <h2 className="text-2xl font-bold leading-relaxed text-neutral-900 md:text-3xl">
                        {aiQuestions[activeQuestion].question}
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-neutral-700">
                        Votre réponse détaillée :
                      </label>
                      <textarea
                        className="min-h-[200px] w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-800 placeholder:text-neutral-400 transition-all focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                        placeholder="Structurez votre réponse technique ici. Mentionnez les annotations, le nom des classes ou l'architecture mise en place..."
                        value={answers[activeQuestion] ?? ""}
                        onChange={(e) => setAnswers(prev => ({ ...prev, [activeQuestion]: e.target.value }))}
                      />
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
                      <button
                        onClick={() => setView("profile")}
                        className="px-4 py-2 font-medium text-neutral-500 transition-colors hover:text-neutral-800"
                      >
                        Annuler
                      </button>

                      {activeQuestion < aiQuestions.length - 1 ? (
                        <Button
                          variant="primary"
                          className="gap-2 px-6 py-3 shadow-lg shadow-primary-500/20"
                          onClick={() => setActiveQuestion((prev) => prev + 1)}
                        >
                          Question Suivante
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      ) : (
                        <button className="flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 font-bold text-accent-700 shadow-lg shadow-accent-500/20 transition-colors hover:bg-accent-400" onClick={completeEvaluation}>
                          <CheckCircle2 className="h-5 w-5" />
                          Terminer l'évaluation
                        </button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 4: RESULTS */}
          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-xl flex-col items-center justify-center py-20 text-center"
            >
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success-50 shadow-inner">
                <CheckCircle2 className="h-12 w-12 text-success-500" />
              </div>
              <h2 className="mb-4 text-3xl font-bold">Évaluation terminée !</h2>
              <p className="mb-8 text-lg text-neutral-500">
                Vos réponses ont été validées avec succès. L'IA a analysé votre performance et les résultats seront consultables par votre équipe d'encadrement dans le cadre du suivi de votre PFE.
              </p>
              <Link
                href="/student/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-8 py-4 font-bold text-white shadow-xl shadow-primary-900/20 transition-all hover:scale-105 hover:bg-primary-800"
              >
                Retour au tableau de bord
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
