"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Briefcase, ExternalLink, Filter, MapPin, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchOpportunities } from "@/lib/api/opportunities";
import type { ContractType, Opportunity } from "@/types";

const CONTRACT_LABEL: Record<ContractType, string> = {
  internship: "Stage",
  apprenticeship: "Apprentissage",
  cdd: "CDD",
  cdi: "CDI",
  freelance: "Freelance",
};

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [query, setQuery] = useState("");
  const [contract, setContract] = useState<ContractType | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities()
      .then(setOpportunities)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesQuery =
        !query ||
        opp.title.toLowerCase().includes(query.toLowerCase()) ||
        opp.company.toLowerCase().includes(query.toLowerCase());
      const matchesContract = contract === "all" || opp.contractType === contract;
      return matchesQuery && matchesContract;
    });
  }, [opportunities, query, contract]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Opportunités
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Offres recommandées en fonction de votre profil et de vos compétences actuelles.
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Filter
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              strokeWidth={1.5}
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher par poste, entreprise…"
              className="pl-9"
            />
          </div>
          <Select
            value={contract}
            onChange={(event) => setContract(event.target.value as ContractType | "all")}
            className="w-full sm:w-48"
          >
            <option value="all">Tous les contrats</option>
            <option value="internship">Stage</option>
            <option value="apprenticeship">Apprentissage</option>
            <option value="cdd">CDD</option>
            <option value="cdi">CDI</option>
            <option value="freelance">Freelance</option>
          </Select>
        </div>
      </Card>

      {loading ? (
        <p className="text-sm text-neutral-600" aria-live="polite">Chargement des opportunités…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="Aucune opportunité ne correspond"
          description="Modifiez vos filtres ou revenez plus tard. Les offres sont mises à jour quotidiennement."
        />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.map((opportunity) => (
            <li key={opportunity.id}>
              <OpportunityCard opportunity={opportunity} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone="primary">{CONTRACT_LABEL[opportunity.contractType]}</Badge>
            {opportunity.urgent ? (
              <Badge tone="danger" className="gap-1">
                <AlertCircle className="h-3 w-3" strokeWidth={2} aria-hidden />
                Urgent
              </Badge>
            ) : null}
          </div>
          <h3 className="mt-3 text-base font-semibold text-neutral-900">
            {opportunity.title}
          </h3>
          <p className="mt-0.5 text-sm text-neutral-600">{opportunity.company}</p>
        </div>

        <div className="shrink-0 rounded-lg bg-accent-50 px-3 py-2 text-right">
          <p className="flex items-center gap-1 text-xs font-medium text-accent-600">
            <Sparkles className="h-3 w-3" strokeWidth={2} aria-hidden />
            Match
          </p>
          <p className="text-lg font-semibold text-accent-600">{opportunity.matchScore}%</p>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-600">
        <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        {opportunity.location}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {opportunity.skills.map((skill) => (
          <li key={skill}>
            <Badge tone="neutral">{skill}</Badge>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex justify-end">
        <a
          href={opportunity.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition-colors hover:border-primary-500/40 hover:bg-neutral-50"
        >
          Postuler
          <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
        </a>
      </div>
    </Card>
  );
}
