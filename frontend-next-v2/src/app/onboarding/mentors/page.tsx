"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, GraduationCap, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StepActions } from "@/components/onboarding/step-actions";

type MentorRole = "academic" | "professional";

function MentorBlock({
  role,
  title,
  subtitle,
  icon: Icon,
}: {
  role: MentorRole;
  title: string;
  subtitle: string;
  icon: typeof GraduationCap;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
          <Icon className="h-4 w-4" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor={`${role}-name`} required>
            Nom complet
          </Label>
          <Input
            id={`${role}-name`}
            name={`${role}-name`}
            required
            placeholder="Dr. Hatem Belaïd"
          />
        </Field>
        <Field>
          <Label htmlFor={`${role}-email`} required>
            Email
          </Label>
          <Input
            id={`${role}-email`}
            name={`${role}-email`}
            type="email"
            required
            placeholder="hatem.belaid@ensi.tn"
          />
        </Field>
      </div>
    </div>
  );
}

export default function MentorsStepPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // TODO(backend): POST /api/students/mentors → trigger invitation emails
    router.push("/onboarding/cv");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm text-neutral-500">Étape 2 sur 6</p>
        <h1 className="mt-1 text-[28px] font-semibold leading-tight text-neutral-900">
          Qui sont vos encadrants ?
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Renseignez votre encadrant académique et votre encadrant professionnel.
          Assurez-vous qu'ils s'inscrivent sur Mentora pour valider et
          superviser votre PFE.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="flex items-start gap-3 p-4 mb-6 border-primary-500/20 bg-primary-50/40">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 border border-primary-500/20">
            <Mail className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="text-sm text-neutral-700">
            <p className="font-medium text-neutral-900">
              Informez vos encadrants
            </p>
            <p className="mt-1">
              Vos encadrants doivent créer leurs comptes eux-mêmes sur Mentora. 
              Une fois inscrits, ils pourront interagir avec votre PFE pour le suivi
              et l&apos;évaluation.
            </p>
          </div>
        </Card>

        <div className="grid gap-6">
          <MentorBlock
            role="academic"
            icon={GraduationCap}
            title="Encadrant académique"
            subtitle="Enseignant ou enseignant-chercheur de votre établissement."
          />
          <MentorBlock
            role="professional"
            icon={Briefcase}
            title="Encadrant professionnel"
            subtitle="Référent côté entreprise ou organisation d'accueil."
          />
        </div>

        <StepActions
          current="mentors"
          nextLabel="Confirmer les encadrants"
          isSubmitting={submitting}
        />
      </form>
    </div>
  );
}
