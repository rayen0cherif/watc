"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioCard } from "@/components/ui/radio-card";
import { StepActions } from "@/components/onboarding/step-actions";
import { NIVEAU_OPTIONS } from "@/lib/onboarding-data";

export default function AccountStepPage() {
  const router = useRouter();
  const [niveau, setNiveau] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO(backend): POST /api/auth/register
    router.push("/onboarding/mentors");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 1 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Créez votre espace étudiant
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Quelques informations pour personnaliser votre suivi de PFE et
          générer une évaluation adaptée à votre parcours.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <Label htmlFor="specialite" required>
                Spécialité
              </Label>
              <Input
                id="specialite"
                name="specialite"
                autoComplete="off"
                required
                placeholder="Genie Logiciel, Data Science..."
              />
            </Field>

            <Field>
              <Label htmlFor="etablissement">Établissement</Label>
              <Input
                id="etablissement"
                name="etablissement"
                placeholder="ENSI, INSAT, ESPRIT…"
              />
            </Field>
          </div>

          <div className="mt-6 border-t border-neutral-200 pt-6">
            <Label required>Niveau actuel</Label>
            <p className="mt-1 text-sm text-neutral-500">
              Détermine le format et la profondeur de votre PFE.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {NIVEAU_OPTIONS.map((opt) => (
                <RadioCard
                  key={opt.value}
                  name="niveau"
                  value={opt.value}
                  checked={niveau === opt.value}
                  onChange={setNiveau}
                  label={opt.label}
                  description={opt.description}
                />
              ))}
            </div>
          </div>
        </Card>

        <StepActions
          current="account"
          nextLabel="Créer mon compte"
          canSubmit={Boolean(niveau)}
          isSubmitting={submitting}
        />

        <p className="mt-6 text-center text-sm text-neutral-500">
          Déjà inscrit ?{" "}
          <a
            href="/login"
            className="font-medium text-primary-600 hover:text-primary-700"
          >
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}
