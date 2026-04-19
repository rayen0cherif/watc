"use client";

import { useEffect, useState } from "react";
import { Bell, Check, LogOut, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Avatar } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/providers/auth-provider";
import { initials } from "@/lib/format";

export default function StudentSettingsPage() {
  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [saving, setSaving] = useState(false);

  const [notifMeeting, setNotifMeeting] = useState(true);
  const [notifDeliverable, setNotifDeliverable] = useState(true);
  const [notifEvaluation, setNotifEvaluation] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      // TODO(backend): PATCH /api/student/profile
      await new Promise((resolve) => setTimeout(resolve, 300));
      login(user.role, { ...user, name, email });
      toast.success("Profil mis à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Gérez vos informations personnelles, préférences et sécurité.
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>

        <div className="mb-6 flex items-center gap-4">
          <Avatar initials={initials(name || user.name)} size="lg" />
          <div>
            <p className="text-sm font-medium text-neutral-900">{name || user.name}</p>
            <p className="text-xs text-neutral-600">
              Rôle : {user.role === "student" ? "Étudiant" : "Encadrant"}
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="grid gap-4 sm:grid-cols-2" noValidate>
          <Field id="settings-name" label="Nom complet" required>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
            />
          </Field>
          <Field id="settings-email" label="Adresse e-mail" required>
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </Field>
          <div className="col-span-full flex justify-end">
            <Button type="submit" variant="primary" loading={saving}>
              <Check className="h-4 w-4" strokeWidth={1.5} />
              Enregistrer
            </Button>
          </div>
        </form>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences de notification</CardTitle>
        </CardHeader>

        <ul className="space-y-3">
          <PreferenceRow
            title="Rendez-vous planifiés"
            description="E-mail lorsqu'un encadrant planifie un rendez-vous."
            checked={notifMeeting}
            onChange={setNotifMeeting}
          />
          <PreferenceRow
            title="Livrables validés ou refusés"
            description="Notification après chaque décision de votre encadrant."
            checked={notifDeliverable}
            onChange={setNotifDeliverable}
          />
          <PreferenceRow
            title="Nouvelles évaluations"
            description="Soyez informé dès qu'une évaluation est publiée."
            checked={notifEvaluation}
            onChange={setNotifEvaluation}
          />
          <PreferenceRow
            title="Résumé hebdomadaire"
            description="Un e-mail chaque lundi avec vos priorités de la semaine."
            checked={notifWeeklyDigest}
            onChange={setNotifWeeklyDigest}
          />
        </ul>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Mot de passe</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Dernière mise à jour : il y a plus de 3 mois.
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toast.info("Fonctionnalité bientôt disponible.")}
          >
            Changer le mot de passe
          </Button>
        </div>

        <div className="mt-5 border-t border-neutral-200 pt-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-900">Déconnexion</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Vous serez redirigé vers la page de connexion.
            </p>
          </div>
          <Button type="button" variant="destructive" size="sm" onClick={handleLogout} className="mt-3 sm:mt-0">
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Se déconnecter
          </Button>
        </div>
      </Card>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-white p-4">
      <Checkbox
        id={`pref-${title}`}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <label htmlFor={`pref-${title}`} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-medium text-neutral-900">{title}</span>
        <span className="mt-0.5 block text-xs text-neutral-600">{description}</span>
      </label>
    </li>
  );
}
