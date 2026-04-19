import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

type Trend = "up" | "down" | "neutral";

type SummaryCardProps = {
  label: string;
  value: string;
  context: string;
  trend?: Trend;
  trendValue?: string;
};

function SummaryCard({
  label,
  value,
  context,
  trend = "neutral",
  trendValue,
}: SummaryCardProps) {
  const TrendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : Minus;
  const trendColor =
    trend === "up"
      ? "text-success-600"
      : trend === "down"
      ? "text-danger-500"
      : "text-neutral-500";

  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-neutral-500">{label}</p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-[28px] font-semibold leading-none text-neutral-900">
          {value}
        </span>
        {trendValue && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              trendColor
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" strokeWidth={2.5} />
            {trendValue}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm text-neutral-600">{context}</p>
    </Card>
  );
}

export function SummaryCards({ summary }: { summary: any }) {
  if (!summary) return null;
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label="Étudiants supervisés"
        value={`${summary.studentsTotal}`}
        context={`${summary.studentsCapacity - summary.studentsTotal} places restantes sur ${summary.studentsCapacity}`}
      />
      <SummaryCard
        label="Alertes en cours"
        value={`${summary.alertsTotal}`}
        context={`${summary.alertsCritical} critique · à traiter cette semaine`}
        trend="down"
        trendValue="−1"
      />
      <SummaryCard
        label="Progression moyenne"
        value={`${summary.averageProgress}%`}
        context="Cumul de la promotion encadrée"
        trend="up"
        trendValue={`+${summary.progressDelta} pts`}
      />
      <SummaryCard
        label="Évaluations à venir"
        value={`${summary.upcomingEvaluations}`}
        context={`${summary.upcomingThisWeek} planifiées sous 7 jours`}
      />
    </div>
  );
}
