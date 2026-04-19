"use client";

import { useMemo, useState } from "react";
import { Search, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  STATUS_LABEL,
  type StudentStatus,
  type SupervisorStudent,
} from "@/types/supervisor";
import { cn } from "@/lib/cn";

type FilterValue = "tous" | StudentStatus;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "actif", label: "Actif" },
  { value: "a-risque", label: "À risque" },
  { value: "en-attente", label: "En attente" },
  { value: "termine", label: "Terminé" },
];

const STATUS_VARIANT: Record<
  StudentStatus,
  "success" | "danger" | "warning" | "neutral"
> = {
  actif: "success",
  "a-risque": "danger",
  "en-attente": "warning",
  termine: "neutral",
};

function ProgressBar({ value }: { value: number }) {
  const tone =
    value >= 75
      ? "bg-success-500"
      : value >= 40
      ? "bg-primary-500"
      : "bg-warning-500";
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-32 overflow-hidden rounded-lg bg-neutral-100"
      >
        <div
          className={cn("h-full rounded-lg transition-all duration-200", tone)}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium tabular-nums text-neutral-700">
        {value}%
      </span>
    </div>
  );
}

function StudentCell({ student }: { student: SupervisorStudent }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold text-neutral-700">
        {student.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-neutral-900">
          {student.name}
        </p>
        <p className="truncate text-sm text-neutral-500">{student.promo}</p>
      </div>
    </div>
  );
}

export function StudentTable({ students = [] }: { students: SupervisorStudent[] }) {
  const [filter, setFilter] = useState<FilterValue>("tous");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return students.filter((s) => {
      if (filter !== "tous" && s.status !== filter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.projectTitle.toLowerCase().includes(q)
      );
    });
  }, [filter, query, students]);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-neutral-200 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-neutral-900">
            Étudiants supervisés
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {filtered.length} sur {students.length} affichés
          </p>
        </div>

        <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center">
          <div className="relative w-full lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un étudiant ou un projet"
              className="pl-9"
              aria-label="Rechercher un étudiant"
            />
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
            <TabsList>
              {FILTERS.map((f) => (
                <TabsTrigger key={f.value} value={f.value}>
                  {f.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Étudiant</TableHead>
            <TableHead>PFE</TableHead>
            <TableHead>Progression</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Alerte</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="py-3">
                <StudentCell student={student} />
              </TableCell>
              <TableCell className="max-w-[280px] py-3">
                <p className="truncate font-medium text-neutral-900">
                  {student.projectTitle}
                </p>
                <p className="mt-1 truncate text-sm text-neutral-500">
                  Prochain : {student.nextMilestone}
                </p>
              </TableCell>
              <TableCell className="py-3">
                <ProgressBar value={student.progress} />
              </TableCell>
              <TableCell className="py-3">
                <Badge variant={STATUS_VARIANT[student.status]} withDot>
                  {STATUS_LABEL[student.status]}
                </Badge>
              </TableCell>
              <TableCell className="py-3">
                {student.hasAlert ? (
                  <span className="inline-flex items-center gap-2 text-sm text-danger-500">
                    <AlertTriangle className="h-4 w-4" strokeWidth={2} />
                    {student.alertReason}
                  </span>
                ) : (
                  <span className="text-sm text-neutral-400">—</span>
                )}
              </TableCell>
              <TableCell className="py-3 text-right">
                <Button variant="ghost" size="sm" aria-label={`Ouvrir ${student.name}`}>
                  Ouvrir
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {filtered.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="py-16 text-center text-sm text-neutral-500"
              >
                Aucun étudiant ne correspond à ces critères.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
