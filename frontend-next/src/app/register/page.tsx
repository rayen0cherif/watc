"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, BookOpen, GraduationCap, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { registerSchema, type RegisterInput } from "@/lib/validators/auth";
import { useAuth } from "@/providers/auth-provider";
import type { Role } from "@/types";

const ROLES: Array<{ value: Role; label: string; hint: string }> = [
  { value: "student", label: "Étudiant", hint: "Je démarre un PFE." },
  { value: "supervisor", label: "Encadrant", hint: "J'encadre des étudiants." },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "student", name: "", email: "", password: "" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    setSubmitting(true);
    try {
      // TODO(backend): POST /api/auth/register
      await new Promise((resolve) => setTimeout(resolve, 400));
      login(data.role, { name: data.name, email: data.email });
      toast.success("Compte créé. Bienvenue sur Mentora.");
      if (data.role === "student") {
        router.push("/onboarding/pfe");
      } else {
        // TODO(mentor): send to supervisor dashboard once built
        router.push("/login");
        toast.info("L'espace encadrant sera bientôt disponible.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo />
          <h1 className="text-2xl font-semibold text-neutral-900">Créer votre compte Mentora</h1>
          <p className="text-sm text-neutral-600">
            Sélectionnez votre rôle, remplissez vos informations, et démarrez dans la minute.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
            {/* Role selection */}
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-neutral-900">
                Je m'inscris en tant que
              </legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {ROLES.map((role) => {
                  const active = selectedRole === role.value;
                  return (
                    <label
                      key={role.value}
                      className={cn(
                        "relative flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-colors",
                        active
                          ? "border-primary-500 bg-primary-50 ring-2 ring-primary-500/20"
                          : "border-neutral-200 bg-white hover:border-primary-500/40",
                      )}
                    >
                      <input
                        type="radio"
                        value={role.value}
                        className="sr-only"
                        checked={active}
                        onChange={() => setValue("role", role.value, { shouldValidate: true })}
                      />
                      <span
                        className={cn(
                          "text-sm font-semibold",
                          active ? "text-primary-600" : "text-neutral-900",
                        )}
                      >
                        {role.label}
                      </span>
                      <span className="text-xs text-neutral-600">{role.hint}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Field id="name" label="Nom complet" error={errors.name?.message} required>
              <div className="relative">
                <User
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Lina Meziou"
                  invalid={!!errors.name}
                  className="pl-9"
                  {...register("name")}
                />
              </div>
            </Field>

            <Field id="email" label="Adresse e-mail" error={errors.email?.message} required>
              <div className="relative">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="prenom.nom@univ.tn"
                  invalid={!!errors.email}
                  className="pl-9"
                  {...register("email")}
                />
              </div>
            </Field>

            <Field
              id="password"
              label="Mot de passe"
              helper="8 caractères minimum."
              error={errors.password?.message}
              required
            >
              <div className="relative">
                <Lock
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                  strokeWidth={1.5}
                />
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  invalid={!!errors.password}
                  className="pl-9"
                  {...register("password")}
                />
              </div>
            </Field>

            {selectedRole === "student" ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="level" label="Niveau d'études" error={errors.level?.message} required>
                  <div className="relative">
                    <GraduationCap
                      aria-hidden
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                      strokeWidth={1.5}
                    />
                    <Select
                      id="level"
                      defaultValue=""
                      className="pl-9"
                      invalid={!!errors.level}
                      {...register("level")}
                    >
                      <option value="" disabled>
                        Sélectionnez votre niveau
                      </option>
                      <option value="L3">Licence 3</option>
                      <option value="M1">Master 1</option>
                      <option value="M2">Master 2</option>
                      <option value="Ingénierie">Ingénierie (5ᵉ année)</option>
                    </Select>
                  </div>
                </Field>

                <Field id="specialty" label="Spécialité" error={errors.specialty?.message} required>
                  <div className="relative">
                    <BookOpen
                      aria-hidden
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                      strokeWidth={1.5}
                    />
                    <Input
                      id="specialty"
                      type="text"
                      placeholder="Ex. Génie logiciel"
                      invalid={!!errors.specialty}
                      className="pl-9"
                      {...register("specialty")}
                    />
                  </div>
                </Field>
              </div>
            ) : null}

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-600">Vous avez déjà un compte ?</span>
              <Link href="/login" className="font-medium text-primary-600 hover:underline">
                Se connecter
              </Link>
            </div>

            <Button type="submit" size="lg" loading={submitting} className="mt-2 w-full">
              {selectedRole === "student" ? "Créer un compte et continuer" : "Créer un compte"}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
