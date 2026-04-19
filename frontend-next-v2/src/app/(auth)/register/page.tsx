"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { fetchApi } from "@/lib/api";

type Role = "etudiant" | "encadrant";

const ROLES: { value: Role; label: string; description: string }[] = [
  {
    value: "etudiant",
    label: "Étudiant",
    description: "Je prépare mon Projet de Fin d'Études",
  },
  {
    value: "encadrant",
    label: "Encadrant",
    description: "Je supervise des étudiants en PFE",
  },
];

const ROLE_MAP: Record<Role, string> = {
  etudiant: "STUDENT",
  encadrant: "ACADEMIC_MENTOR",
};

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("etudiant");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordsMatch = password === confirmPassword;
  const filled =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= 6 &&
    passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filled) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetchApi<{
        token: string;
        fullName: string;
        email: string;
        role: string;
        initials: string;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: `${firstName} ${lastName}`,
          email,
          password,
          role: ROLE_MAP[role],
          department: "",
        }),
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify({
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        initials: res.initials,
      }));

      if (res.role === "STUDENT") {
        router.push("/onboarding/account");
      } else {
        router.push("/supervisor/dashboard");
      }
    } catch (err: any) {
      setError("Erreur lors de la création du compte. Cet email est peut-être déjà utilisé.");
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-semibold leading-tight text-neutral-900">
          Créer un compte
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Rejoignez Mentora pour structurer et réussir votre PFE.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role selector */}
          <Field>
            <Label required>Vous êtes</Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-200 ease-in-out hover:-translate-y-px",
                    role === r.value
                      ? "border-primary-500 bg-primary-50/40"
                      : "border-neutral-200 bg-white hover:bg-neutral-50"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "mb-2 flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-200",
                      role === r.value
                        ? "border-primary-500 bg-primary-500"
                        : "border-neutral-300"
                    )}
                  >
                    {role === r.value && (
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-sm font-medium text-neutral-900">
                    {r.label}
                  </span>
                  <span className="mt-0.5 text-sm text-neutral-500">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          </Field>

          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Label htmlFor="reg-firstname" required>
                Prénom
              </Label>
              <Input
                id="reg-firstname"
                placeholder="Ahmed"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="reg-lastname" required>
                Nom
              </Label>
              <Input
                id="reg-lastname"
                placeholder="Ben Ali"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Field>
          </div>

          <Field>
            <Label htmlFor="reg-email" required>
              Adresse e-mail
            </Label>
            <Input
              id="reg-email"
              type="email"
              placeholder="prenom.nom@etablissement.tn"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="reg-password" required>
              Mot de passe
            </Label>
            <Input
              id="reg-password"
              type="password"
              placeholder="Min. 6 caractères"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field>
            <Label htmlFor="reg-confirm" required>
              Confirmer le mot de passe
            </Label>
            <Input
              id="reg-confirm"
              type="password"
              placeholder="Retapez votre mot de passe"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-danger-500">
                Les mots de passe ne correspondent pas.
              </p>
            )}
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!filled || loading}
            className="h-10 w-full"
          >
            {loading ? "Création en cours…" : "Créer mon compte"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/login"
          className="font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
