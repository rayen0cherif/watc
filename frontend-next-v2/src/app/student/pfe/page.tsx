"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Building,
  Users,
  Calendar,
  Upload,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fetchApi } from "@/lib/api";
import type { ProjectData, Deliverable } from "@/lib/types";

const DEFAULT_DELIVERABLES: Deliverable[] = [
  { id: 1, name: "Link GitHub", type: "Lien", status: "en_cours", date: "30 Juin 2026" },
  { id: 2, name: "Rapport", type: "PDF", status: "a_faire", date: "30 Juin 2026" },
  { id: 3, name: "Présentation", type: "PPTX", status: "a_faire", date: "10 Juil 2026" },
];

function getStatusIcon(status: string) {
  switch (status) {
    case "validé":
      return <CheckCircle2 className="h-5 w-5 text-success-500" />;
    case "en_attente":
      return <Clock className="h-5 w-5 text-warning-500" />;
    case "en_cours":
      return <Activity className="h-5 w-5 text-primary-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-neutral-300" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "validé":
      return <Badge variant="success">Validé</Badge>;
    case "en_attente":
      return <Badge variant="warning">En révision</Badge>;
    case "en_cours":
      return (
        <Badge variant="primary" withDot>
          En cours
        </Badge>
      );
    default:
      return <Badge variant="neutral">À faire</Badge>;
  }
}

export default function StudentPFEPage() {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [deliverables, setDeliverables] = useState<Deliverable[]>(DEFAULT_DELIVERABLES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<ProjectData>("/projects/mine")
      .then(async (proj) => {
        setProject(proj);
        const dels = await fetchApi<Deliverable[]>(`/projects/${proj.id}/deliverables`).catch(() => DEFAULT_DELIVERABLES);
        if (dels && dels.length > 0) setDeliverables(dels);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-[1024px] px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900">
            <FileText className="h-6 w-6 text-primary-500" />
            Mon Projet de Fin d&apos;Études
          </h1>
          <p className="text-neutral-500">
            Gérez les informations, les encadrants et les livrables de votre
            PFE.
          </p>
        </div>
        <Button variant="secondary">Modifier les détails</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Main Details */}
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <Badge
                  variant="primary"
                  className="mb-3"
                >
                  Sujet Validé
                </Badge>
                <h2 className="mb-2 text-xl font-bold text-neutral-900">
                  {project?.title || "Chargement..."}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-neutral-500">
                  {project?.description || ""}
                </p>
              </div>



              <div className="grid grid-cols-2 gap-4 border-t border-neutral-200 pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 rounded-lg bg-primary-50 p-1.5 text-primary-500" />
                  <div>
                    <p className="text-2xs font-semibold uppercase text-neutral-500">
                      Début
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {project?.startDate || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-8 w-8 rounded-lg bg-success-50 p-1.5 text-success-500" />
                  <div>
                    <p className="text-2xs font-semibold uppercase text-neutral-500">
                      Soutenance prévue
                    </p>
                    <p className="text-sm font-medium text-neutral-900">
                      {project?.defenseDate || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary-500" />
                Livrables du projet
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deliverables.map((del) => (
                  <div
                    key={del.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-200 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(del.status)}
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900">
                          {del.name}
                        </h4>
                        <p className="text-2xs text-neutral-500">
                          Échéance: {del.date} • Format: {del.type}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      {getStatusBadge(del.status)}
                      {del.status === "validé" ||
                      del.status === "en_attente" ? (
                        <button
                          className="rounded-lg p-2 text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-500"
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      ) : (
                        <Button variant="primary" size="sm">
                          <Upload className="h-3.5 w-3.5" />
                          Soumettre
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Supervision */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary-500" />
                Encadrement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Academic */}
                <div>
                  <span className="mb-2 block text-2xs font-bold uppercase tracking-wider text-primary-500">
                    Encadrant Académique
                  </span>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 font-bold text-primary-500">
                      DK
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {"Dr. Karim B."}
                      </p>
                      <p className="text-2xs text-neutral-500">
                        {"Professeur des Universités"}
                      </p>
                      <p className="mt-0.5 text-2xs text-neutral-500">
                        {"Université Paris-Saclay"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-neutral-200" />

                {/* Professional */}
                <div>
                  <span className="mb-2 block text-2xs font-bold uppercase tracking-wider text-accent-700">
                    Encadrant Professionnel
                  </span>
                  <div className="mb-3 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-50 font-bold text-accent-700">
                      SM
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-neutral-900">
                        {"Sarah M."}
                      </p>
                      <p className="text-2xs text-neutral-500">
                        {"Tech Lead"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-3">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                      <Building className="h-4 w-4 text-neutral-400" />
                      {project?.companyName || "TechCorp Solutions"}
                    </div>
                    <p className="pl-6 text-2xs text-neutral-500">
                      {project?.companyAddress || "123 Avenue de l'Innovation, Paris"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-bold text-primary-700">
              <ExternalLink className="h-4 w-4" />
              Ressources utiles
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary-500 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Guide de rédaction du rapport
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary-500 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Template de présentation PPT
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-primary-500 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Charte des PFE
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
