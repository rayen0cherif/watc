"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  Send,
  TrendingUp,
  BrainCircuit,
  FileText,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { fetchApi } from "@/lib/api";
import type { ProjectData } from "@/lib/types";

type Milestone = {
  id: number;
  title: string;
  status: "terminé" | "en cours" | "bloqué" | "à faire";
  date: string;
};

function fmtDate(d: Date): string {
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function computeMilestones(project: ProjectData): Milestone[] {
  const now = new Date();
  const start = project.startDate ? new Date(project.startDate) : null;
  const end = project.deadline ? new Date(project.deadline) : null;
  const defense = project.defenseDate ? new Date(project.defenseDate) : null;

  if (!start || !end) return [];

  const span = end.getTime() - start.getTime();
  const dates = [
    new Date(start.getTime() + span * 0.15),
    new Date(start.getTime() + span * 0.35),
    new Date(start.getTime() + span * 0.60),
    end,
    defense || new Date(end.getTime() + 14 * 24 * 60 * 60 * 1000),
  ];
  const titles = [
    "Analyse des besoins",
    "Conception de l'architecture",
    "Implémentation (Sprint 1)",
    "Tests et Validation",
    "Soutenance",
  ];

  let currentSet = false;
  return titles.map((title, i) => {
    const d = dates[i];
    let status: Milestone["status"];
    if (d < now) {
      status = "terminé";
    } else if (!currentSet) {
      status = "en cours";
      currentSet = true;
    } else {
      status = "à faire";
    }
    return { id: i + 1, title, status, date: fmtDate(d) };
  });
}

const DEFAULT_SKILLS = [
  { name: "React / Frontend", progress: 85 },
  { name: "Node.js / Backend", progress: 60 },
  { name: "Bases de données", progress: 70 },
  { name: "Gestion de projet (Agile)", progress: 90 },
];

export default function StudentDashboardPage() {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [dynamicSkills, setDynamicSkills] = useState(DEFAULT_SKILLS);
  const [loading, setLoading] = useState(true);

  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [journalContent, setJournalContent] = useState("");
  const [journalBlocks, setJournalBlocks] = useState("");
  const [journalNext, setJournalNext] = useState("");
  const [journals, setJournals] = useState<any[]>([]);
  const [submittingJournal, setSubmittingJournal] = useState(false);

  useEffect(() => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    const localUser = userStr ? JSON.parse(userStr) : null;

    fetchApi<ProjectData>("/projects/mine")
      .then((proj) => {
        setProject(proj);
        setMilestones(computeMilestones(proj));
        return fetchApi<any[]>(`/projects/${proj.id}/journal`).catch(() => []);
      })
      .then((j) => setJournals(j))
      .catch((error) => {
        console.error("Failed to load project:", error);
        
        // Create a fallback project if user exists but has no project
        if (localUser) {
          const fallback: ProjectData = {
            id: 0,
            title: "Projet en attente de création",
            description: "Veuillez contacter votre encadrant pour créer votre projet",
            startDate: new Date().toISOString().split('T')[0],
            deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            defenseDate: null,
            companyName: localUser.companyName || null,
            companyAddress: null,
            progress: 0,
            aiScore: 0,
            student: { 
              id: localUser.id || 0, 
              fullName: localUser.fullName, 
              email: localUser.email, 
              role: localUser.role, 
              department: localUser.department || "GL", 
              initials: localUser.initials 
            },
          };
          setProject(fallback);
          setMilestones(computeMilestones(fallback));
        }
      })
      .finally(() => setLoading(false));

    fetchApi<any>("/ai/evaluation")
      .then((res) => {
        if (res.profile?.skills) {
          const mapped = res.profile.skills.map((s: any) => ({
            name: s.name,
            progress: 60 + (s.name.split("").reduce((h: number, c: string) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0) % 35),
          }));
          setDynamicSkills(mapped);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (project?.student?.fullName && messages.length === 0) {
      const name = project.student.fullName.split(" ")[0];
      setMessages([{ role: "ai", text: `Bonjour ${name} ! Comment avance votre PFE aujourd'hui ?` }]);
    }
  }, [project]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetchApi<{ response: string }>("/ai/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMsg }),
      });
      setMessages((prev) => [...prev, { role: "ai", text: res.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", text: "Désolé, l'assistant IA n'est pas disponible pour le moment." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSubmitJournal = async () => {
    console.log("handleSubmitJournal called");
    console.log("journalContent:", journalContent);
    console.log("project?.id:", project?.id);
    
    if (!journalContent.trim()) {
      console.error("Journal content is empty");
      alert("Veuillez remplir le champ 'Travail réalisé'");
      return;
    }
    
    if (!project?.id || project.id === 0) {
      console.error("No valid project ID");
      alert("Erreur: Vous n'avez pas encore de projet assigné. Veuillez contacter votre encadrant ou vous connecter avec un compte étudiant valide (ex: sami@watc.tn / password123)");
      return;
    }
    
    setSubmittingJournal(true);
    console.log("Submitting journal update...");
    
    try {
      const payload = { 
        content: journalContent, 
        blocks: journalBlocks, 
        nextSteps: journalNext, 
        updateDate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      };
      console.log("Payload:", payload);
      
      const entry = await fetchApi<any>(`/projects/${project.id}/journal`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      
      console.log("Journal update created:", entry);
      setJournals((prev) => [entry, ...prev]);
      setJournalContent("");
      setJournalBlocks("");
      setJournalNext("");
      setShowUpdateModal(false);
      alert("Mise à jour ajoutée avec succès!");
    } catch (error: any) {
      console.error("Failed to submit journal update:", error);
      alert(`Erreur lors de l'ajout de la mise à jour: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setSubmittingJournal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  const studentName = project?.student?.fullName?.split(" ")[0] || "Étudiant";
  const studentInitials = project?.student?.initials || "ET";
  const academicMentor = (project as any)?.academicMentorName || null;
  const proffMentor = (project as any)?.professionalMentorName || null;

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-8 space-y-6">
      {/* ── Header Banner ── */}
      <div className="rounded-2xl bg-primary-900 p-6 text-white shadow-lg sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="rounded-full bg-white/20 px-3 py-1 text-2xs font-semibold backdrop-blur-sm">PFE 2025/2026</span>
              <Badge className="border-accent-500/40 bg-accent-500 text-primary-900 font-bold text-2xs">En cours</Badge>
            </div>
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">{project?.title || "Chargement..."}</h1>
          </div>
          <div className="min-w-[200px] rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-100">Progression Globale</span>
              <span className="text-xl font-bold">{project?.progress || 0}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div className="h-full rounded-full bg-accent-500 shadow-[0_0_10px_rgba(110,220,159,0.5)]" style={{ width: `${project?.progress || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* LEFT 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* ── Milestones ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary-500" />
                Jalons du Projet (Milestones)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <p className="py-6 text-center text-neutral-400 text-sm">Aucun projet configuré. Les jalons s'afficheront une fois votre PFE enregistré.</p>
              ) : (
                <div className="relative pl-3">
                  <div className="absolute bottom-2 left-4 top-2 w-0.5 bg-neutral-200" />
                  <div className="space-y-6">
                    {milestones.map((m) => (
                      <div key={m.id} className="relative flex items-start gap-4">
                        <div className={cn("z-10 mt-1.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-white", m.status === "terminé" && "bg-success-500", m.status === "en cours" && "bg-primary-500", m.status === "bloqué" && "bg-danger-500", m.status === "à faire" && "bg-neutral-300")} />
                        <div className={cn("flex-1 rounded-xl border p-4 transition-all", m.status === "en cours" && "border-primary-100 bg-primary-50/50 shadow-sm", m.status === "bloqué" && "border-danger-50 bg-danger-50/50", m.status !== "en cours" && m.status !== "bloqué" && "border-neutral-200 bg-white")}>
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h3 className={cn("font-semibold", m.status === "terminé" ? "text-neutral-500 line-through" : "text-neutral-900")}>{m.title}</h3>
                            <span className="flex items-center gap-1 text-2xs font-medium text-neutral-500"><Clock className="h-3.5 w-3.5" />{m.date}</span>
                          </div>
                          {m.status === "en cours" && (
                            <div className="mt-3 flex gap-2">
                              <Button variant="primary" size="sm" className="text-2xs">Marquer terminé</Button>
                              <button className="rounded-lg bg-danger-50 px-3 py-1.5 text-2xs font-medium text-danger-500 transition-colors hover:bg-danger-50/80">Signaler blocage</button>
                            </div>
                          )}
                          {m.status === "bloqué" && (
                            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-danger-500"><AlertCircle className="h-4 w-4" /> En attente de validation du mentor</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Journal de bord ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary-500" />Journal de bord</CardTitle>
                <Button variant="primary" size="sm" onClick={() => setShowUpdateModal(true)}><Plus className="h-4 w-4" />Nouvelle mise à jour</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {journals.length === 0 ? (
                  <p className="py-8 text-center text-neutral-400">Aucune mise à jour de journal pour le moment.</p>
                ) : (
                  journals.map((u: any) => (
                    <div key={u.id} className="group rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-primary-200">
                      <div className="mb-3"><span className="text-2xs font-bold uppercase tracking-wider text-primary-500">{u.updateDate || u.date}</span></div>
                      <p className="mb-4 text-sm leading-relaxed text-neutral-900">{u.content}</p>
                      <div className="grid gap-4 border-t border-neutral-200 pt-4 sm:grid-cols-2">
                        <div><span className="mb-1 block text-2xs font-semibold uppercase text-neutral-500">Blocages</span><p className="text-sm font-medium text-danger-500">{u.blocks}</p></div>
                        <div><span className="mb-1 block text-2xs font-semibold uppercase text-neutral-500">Prochaine étape</span><p className="text-sm text-neutral-900">{u.nextSteps || u.next}</p></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT col */}
        <div className="space-y-6">
          {/* ── AI Chat ── */}
          <Card className="flex h-[420px] flex-col">
            <div className="flex items-center gap-3 rounded-t-xl border-b border-neutral-200 bg-primary-50/50 p-4">
              <div className="rounded-lg bg-primary-500 p-2 text-white"><BrainCircuit className="h-5 w-5" /></div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Assistant PFE IA</h3>
                <p className="text-2xs text-neutral-500">Propulsé par Gemini</p>
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto bg-neutral-50/50 p-4">
              {messages.map((msg, i) => (
                <div key={i} className={cn("flex max-w-[85%] gap-3", msg.role === "user" && "ml-auto flex-row-reverse")}>
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", msg.role === "ai" ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-600")}>
                    {msg.role === "ai" ? <BrainCircuit className="h-4 w-4" /> : <span className="text-2xs font-bold">{studentInitials[0]}</span>}
                  </div>
                  <div className={cn("rounded-2xl p-3 text-sm", msg.role === "ai" ? "rounded-tl-sm border border-neutral-200 bg-white text-neutral-900" : "rounded-tr-sm bg-primary-500 text-white")}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex max-w-[85%] gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white"><BrainCircuit className="h-4 w-4" /></div>
                  <div className="rounded-2xl rounded-tl-sm border border-neutral-200 bg-white p-3"><Loader2 className="h-4 w-4 animate-spin text-primary-500" /></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="rounded-b-xl border-t border-neutral-200 bg-white p-3">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <Input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Posez une question à l'IA..." className="flex-1 bg-neutral-100" disabled={chatLoading} />
                <Button variant="primary" size="md" type="submit" className="px-3" disabled={chatLoading || !chatInput.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

          {/* ── Skills ── */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-success-500" />Compétences acquises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dynamicSkills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-neutral-900">{skill.name}</span>
                      <span className="font-semibold text-neutral-500">{skill.progress}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-primary-500 transition-all duration-1000 ease-out" style={{ width: `${skill.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/student/ai-evaluation" className="mt-6 flex w-full items-center justify-center rounded-xl border border-neutral-200 py-2 text-sm font-medium text-primary-500 transition-colors hover:bg-neutral-50">
                Voir l&apos;évaluation détaillée
              </Link>
            </CardContent>
          </Card>

          {/* ── Supervision Team ── */}
          <Card>
            <CardHeader><CardTitle>Équipe d&apos;encadrement</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 font-bold text-primary-500">
                    {academicMentor ? academicMentor.split(" ").map((w: string) => w[0]).slice(0, 2).join("") : "—"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{academicMentor || "Non assigné"}</p>
                    <p className="text-2xs text-neutral-500">Encadrant Académique</p>
                  </div>
                  {academicMentor && (
                    <button className="ml-auto rounded-lg bg-neutral-50 p-1.5 text-neutral-400 transition-colors hover:text-primary-500"><MessageSquare className="h-4 w-4" /></button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-50 font-bold text-accent-700">
                    {proffMentor ? proffMentor.split(" ").map((w: string) => w[0]).slice(0, 2).join("") : project?.companyName?.[0] || "—"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{proffMentor || "Non assigné"}</p>
                    <p className="text-2xs text-neutral-500">Encadrant Pro {project?.companyName ? `(${project.companyName})` : ""}</p>
                  </div>
                  {proffMentor && (
                    <button className="ml-auto rounded-lg bg-neutral-50 p-1.5 text-neutral-400 transition-colors hover:text-primary-500"><MessageSquare className="h-4 w-4" /></button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Journal Modal ── */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg animate-in zoom-in-95 rounded-2xl bg-white p-6 shadow-2xl duration-200">
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Ajouter une mise à jour</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-900">Travail réalisé</label>
                <textarea className="w-full rounded-xl border border-neutral-200 p-3 text-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" rows={3} value={journalContent} onChange={(e) => setJournalContent(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-danger-500">Blocages rencontrés</label>
                <Input placeholder="Ex: Problème d'accès API..." value={journalBlocks} onChange={(e) => setJournalBlocks(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-success-500">Prochaine étape</label>
                <Input value={journalNext} onChange={(e) => setJournalNext(e.target.value)} />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setShowUpdateModal(false)} disabled={submittingJournal}>Annuler</Button>
                <Button 
                  variant="primary" 
                  onClick={() => {
                    console.log("Submit button clicked!");
                    handleSubmitJournal();
                  }} 
                  disabled={submittingJournal || !journalContent.trim()}
                >
                  {submittingJournal ? <Loader2 className="h-4 w-4 animate-spin" /> : "Soumettre"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
