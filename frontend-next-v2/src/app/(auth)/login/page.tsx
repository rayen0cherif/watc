"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetchApi<{
        token: string;
        fullName: string;
        email: string;
        role: string;
        initials: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify({
        fullName: res.fullName,
        email: res.email,
        role: res.role,
        initials: res.initials,
      }));

      if (res.role === "STUDENT") {
        router.push("/student/dashboard");
      } else {
        router.push("/supervisor/dashboard");
      }
    } catch (err: any) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  const filled = email.trim().length > 0 && password.length >= 6;

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-[28px] font-semibold leading-tight text-neutral-900">
          Connexion
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Accédez à votre espace de travail Mentora.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-center text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field>
            <Label htmlFor="login-email" required>
              Adresse e-mail
            </Label>
            <Input
              id="login-email"
              type="email"
              placeholder="prenom.nom@etablissement.tn"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" required>
                Mot de passe
              </Label>
              <Link
                href="#"
                className="text-sm font-medium text-primary-500 transition-colors hover:text-primary-600"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!filled || loading}
            className="h-10 w-full"
          >
            {loading ? "Connexion en cours…" : "Se connecter"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-neutral-600">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="font-medium text-primary-500 transition-colors hover:text-primary-600"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
