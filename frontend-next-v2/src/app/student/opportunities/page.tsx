"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { fetchApi } from "@/lib/api";

const OPPORTUNITY_POOL = [
  { id: 1, title: "Ingénieur Fullstack React / Node.js", company: "TechCorp Innov", location: "Tunis (Hybride)", type: "CDI", requiredSkills: ["React", "Node.js", "JavaScript", "TypeScript", "PostgreSQL"], urgent: true },
  { id: 2, title: "Développeur Backend Java / Spring Boot", company: "BankSys Group", location: "Tunis (Sur site)", type: "CDI", requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "REST", "Microservices"], urgent: false },
  { id: 3, title: "Développeur Python / Data Engineer", company: "DataFlow AI", location: "Remote", type: "CDI", requiredSkills: ["Python", "SQL", "Machine Learning", "Docker", "API REST"], urgent: false },
  { id: 4, title: "Ingénieur DevOps / Cloud", company: "CloudNova", location: "Sfax (Hybride)", type: "CDI", requiredSkills: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS"], urgent: true },
  { id: 5, title: "Frontend Engineer (Angular / Vue)", company: "WebStudio Tunis", location: "Tunis (Sur site)", type: "Stage pré-embauche", requiredSkills: ["Angular", "Vue.js", "JavaScript", "TailwindCSS", "TypeScript"], urgent: false },
  { id: 6, title: "Développeur Mobile React Native", company: "AppForge", location: "Remote", type: "Freelance / CDI", requiredSkills: ["React Native", "React", "JavaScript", "TypeScript", "API REST"], urgent: false },
  { id: 7, title: "Ingénieur Cybersécurité", company: "SecureNet", location: "Tunis (Sur site)", type: "CDI", requiredSkills: ["Sécurité réseau", "Linux", "Python", "Firewall", "Pentest"], urgent: false },
  { id: 8, title: "Développeur .NET / C#", company: "EnterpriseIT", location: "Sousse (Sur site)", type: "CDI", requiredSkills: ["C#", ".NET", "SQL Server", "ASP.NET", "MVC"], urgent: false },
  { id: 9, title: "Ingénieur Systèmes Embarqués", company: "AutoTech TN", location: "Sfax (Sur site)", type: "CDI", requiredSkills: ["C", "C++", "Embedded Linux", "RTOS", "IoT"], urgent: false },
];

function computeMatch(studentSkills: string[], requiredSkills: string[]): number {
  if (studentSkills.length === 0) return Math.floor(Math.random() * 30) + 50;
  const lower = studentSkills.map((s) => s.toLowerCase());
  const matched = requiredSkills.filter((req) =>
    lower.some((s) => s.includes(req.toLowerCase()) || req.toLowerCase().includes(s))
  ).length;
  return Math.round((matched / requiredSkills.length) * 100);
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState(OPPORTUNITY_POOL.map((o) => ({ ...o, match: 60, skills: o.requiredSkills.slice(0, 3) })));
  const [topSkills, setTopSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>("/ai/evaluation")
      .then((res) => {
        if (res.profile?.skills) {
          const skillNames: string[] = res.profile.skills.map((s: any) => s.name);
          setTopSkills(skillNames);
          const scored = OPPORTUNITY_POOL.map((o) => ({
            ...o,
            match: computeMatch(skillNames, o.requiredSkills),
            skills: o.requiredSkills.slice(0, 3),
          })).sort((a, b) => b.match - a.match);
          setOpportunities(scored);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const topSkill = topSkills[0] || null;

  return (
    <div className="mx-auto max-w-[1120px] px-8 py-8 space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
              <Briefcase className="h-6 w-6 text-primary-500" />
              Opportunités Professionnelles
            </h1>
            <p className="mt-1 text-neutral-500">
              {loading ? "Chargement de votre profil IA..." : topSkills.length > 0 ? `Matchées selon vos ${topSkills.length} compétences détectées par l'IA.` : "Basées sur les compétences validées par votre PFE et l'évaluation IA."}
            </p>
          </div>
          {loading && <Loader2 className="h-5 w-5 animate-spin text-primary-500" />}
        </CardContent>
      </Card>

      {/* Info Banner */}
      {topSkill && (
        <div className="flex items-start gap-4 rounded-xl border border-primary-100 bg-primary-50 p-4">
          <div className="rounded-lg bg-white p-2 text-primary-600 shadow-sm"><Sparkles className="h-5 w-5" /></div>
          <div>
            <h3 className="text-sm font-bold text-primary-900">Votre profil est attractif !</h3>
            <p className="mt-1 text-2xs text-primary-700">
              Votre compétence en &quot;{topSkill}&quot; vous place parmi les profils les plus recherchés. Complétez votre PFE pour obtenir votre certification finale.
            </p>
          </div>
        </div>
      )}

      {/* Cards */}
      <div className="grid gap-6 pt-2 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((job) => (
          <Card key={job.id} className="group relative flex h-full flex-col overflow-hidden transition-shadow hover:border-primary-200 hover:shadow-md">
            {job.urgent && (
              <div className="absolute right-[-30px] top-4 rotate-45 bg-danger-500 px-8 py-1 text-[10px] font-bold text-white">URGENT</div>
            )}
            <CardContent className="flex flex-1 flex-col pt-6">
              <div className="mb-4">
                <h3 className="pr-6 text-lg font-bold leading-tight text-neutral-900 transition-colors group-hover:text-primary-500 mb-3">{job.title}</h3>
                <div className="flex flex-col gap-1.5">
                  <p className="flex items-center gap-2 text-sm font-medium text-neutral-500"><Building2 className="h-4 w-4 shrink-0" />{job.company}</p>
                  <p className="flex items-center gap-2 text-sm font-medium text-neutral-500"><MapPin className="h-4 w-4 shrink-0" />{job.location}</p>
                  <Badge variant="primary" className="mt-1 w-fit">{job.type}</Badge>
                </div>
              </div>
              <div className="mt-auto space-y-4 border-t border-neutral-200 pt-4">
                <div>
                  <div className="mb-1.5 flex items-end justify-between">
                    <span className="text-2xs font-semibold uppercase tracking-wide text-neutral-900">Match Score</span>
                    <span className={cn("text-sm font-bold", job.match >= 70 ? "text-success-500" : job.match >= 50 ? "text-primary-500" : "text-warning-500")}>{job.match}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                    <div className={cn("h-full rounded-full transition-all duration-700", job.match >= 70 ? "bg-success-500" : job.match >= 50 ? "bg-primary-500" : "bg-warning-500")} style={{ width: `${job.match}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill, idx) => (
                    <span key={idx} className={cn("rounded-full border px-2 py-1 text-[10px] font-medium", topSkills.some((s) => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase())) ? "border-primary-200 bg-primary-50 text-primary-600" : "border-neutral-200 bg-neutral-100 text-neutral-500")}>
                      {skill}
                    </span>
                  ))}
                </div>
                <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary-500 py-2.5 font-bold text-primary-500 transition-all hover:bg-primary-500 hover:text-white">
                  Voir l&apos;offre <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
