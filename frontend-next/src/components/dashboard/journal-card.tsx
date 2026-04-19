"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Dialog } from "@/components/ui/dialog";
import { formatDateShort } from "@/lib/format";
import { createJournalEntry } from "@/lib/api/pfe";
import type { JournalEntry } from "@/types";

interface JournalCardProps {
  entries: JournalEntry[];
}

export function JournalCard({ entries: initial }: JournalCardProps) {
  const [entries, setEntries] = useState<JournalEntry[]>(initial);
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [blockers, setBlockers] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setSummary("");
    setBlockers("");
    setNextStep("");
    setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (summary.trim().length < 10) {
      setError("Le résumé doit contenir au moins 10 caractères.");
      return;
    }
    setSubmitting(true);
    try {
      const entry = await createJournalEntry({ summary, blockers, nextStep });
      setEntries((prev) => [entry, ...prev]);
      toast.success("Entrée de journal enregistrée.");
      setOpen(false);
      reset();
    } catch {
      toast.error("Impossible d'enregistrer l'entrée.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader
        action={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
            Nouvelle entrée
          </Button>
        }
      >
        <CardTitle>Journal de bord</CardTitle>
      </CardHeader>

      {entries.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Aucune entrée. Ajoutez un point d'étape pour garder la trace de votre avancement.
        </p>
      ) : (
        <ul className="space-y-4">
          {entries.slice(0, 3).map((entry) => (
            <li
              key={entry.id}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                {formatDateShort(entry.date)}
              </p>
              <p className="mt-1 text-sm text-neutral-900">{entry.summary}</p>
              {entry.blockers ? (
                <p className="mt-2 text-xs text-neutral-600">
                  <span className="font-medium text-neutral-900">Blocages : </span>
                  {entry.blockers}
                </p>
              ) : null}
              {entry.nextStep ? (
                <p className="mt-1 text-xs text-neutral-600">
                  <span className="font-medium text-neutral-900">Prochaine étape : </span>
                  {entry.nextStep}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      {entries.length > 3 ? (
        <div className="mt-4 text-right">
          <Link
            href="/student/pfe"
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            Voir toutes les entrées
          </Link>
        </div>
      ) : null}

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          reset();
        }}
        title="Ajouter une entrée au journal"
        description="Résumez vos avancées, signalez vos blocages et prévoyez la prochaine étape."
      >
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Field
            id="journal-summary"
            label="Résumé des avancées"
            error={error ?? undefined}
            required
          >
            <Textarea
              id="journal-summary"
              rows={3}
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Ex. Implémentation de l'authentification terminée."
              invalid={!!error}
            />
          </Field>
          <Field id="journal-blockers" label="Blocages rencontrés">
            <Textarea
              id="journal-blockers"
              rows={2}
              value={blockers}
              onChange={(event) => setBlockers(event.target.value)}
              placeholder="Ex. Refresh token intermittent sur iOS."
            />
          </Field>
          <Field id="journal-next" label="Prochaine étape">
            <Textarea
              id="journal-next"
              rows={2}
              value={nextStep}
              onChange={(event) => setNextStep(event.target.value)}
              placeholder="Ex. Corriger le refresh et démarrer le module Utilisateur."
            />
          </Field>

          <div className="mt-2 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setOpen(false);
                reset();
              }}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
