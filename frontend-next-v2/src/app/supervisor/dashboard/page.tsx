"use client";

import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/supervisor/summary-cards";
import { StudentTable } from "@/components/supervisor/student-table";
import { fetchApi } from "@/lib/api";

const TODAY = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
}).format(new Date());

export default function SupervisorDashboardPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [supervisorInitials, setSupervisorInitials] = useState("HB");

  useEffect(() => {
    // Attempt to get user initials from local storage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.initials) setSupervisorInitials(user.initials);
      } catch (e) {}
    }

    fetchApi<any>("/supervisor/dashboard")
      .then((data) => {
        setDashboard(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load dashboard data", e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1200px] px-8 py-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-neutral-500">{TODAY}</p>
          <h1 className="mt-1 text-xl font-semibold text-neutral-900">
            Tableau de bord
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden w-72 md:block">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={2}
            />
            <Input
              type="search"
              placeholder="Rechercher dans l'espace"
              className="pl-9"
              aria-label="Rechercher dans l'espace encadrant"
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            aria-label="Notifications"
            className="relative h-9 w-9 px-0"
          >
            <Bell className="h-4 w-4" strokeWidth={2} />
            <span
              aria-hidden
              className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger-500"
            />
          </Button>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-semibold text-white"
          >
            {supervisorInitials}
          </div>
        </div>
      </header>

      <div className="mt-8">
        <SummaryCards summary={dashboard} />
      </div>

      <div className="mt-8">
        <StudentTable students={dashboard?.students || []} />
      </div>
    </div>
  );
}
