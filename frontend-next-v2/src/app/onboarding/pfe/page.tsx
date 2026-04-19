"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Field, FieldHint } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StepActions } from "@/components/onboarding/step-actions";

export default function PfeStepPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO(backend): POST /api/students/pfe (subject, description, objectives)
    router.push("/onboarding/stack");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 4 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Présentez votre sujet de PFE
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Soyez clair et concis. Vos encadrants pourront ajuster ces éléments
          après la première revue.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="grid gap-6">
            <Field>
              <Label htmlFor="title" required>
                Titre du PFE
              </Label>
              <Input
                id="title"
                name="title"
                required
                maxLength={120}
                placeholder="Plateforme intelligente de suivi des PFE"
              />
              <FieldHint>120 caractères maximum.</FieldHint>
            </Field>

            <Field>
              <Label htmlFor="description" required>
                Description du sujet
              </Label>
              <Textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                maxLength={1500}
                placeholder="Présentez le contexte, la problématique et le périmètre fonctionnel."
              />
              <FieldHint>{description.length} / 1500</FieldHint>
            </Field>

            <Field>
              <Label htmlFor="objectives" required>
                Objectifs du projet
              </Label>
              <Textarea
                id="objectives"
                name="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                rows={5}
                required
                maxLength={1000}
                placeholder={"Listez 3 à 5 objectifs concrets, par exemple :\n· Réduire le temps de validation des livrables de 40%.\n· Centraliser les évaluations sur une interface unique."}
              />
              <FieldHint>{objectives.length} / 1000</FieldHint>
            </Field>
          </div>
        </Card>

        <StepActions current="pfe" isSubmitting={submitting} />
      </form>
    </div>
  );
}
