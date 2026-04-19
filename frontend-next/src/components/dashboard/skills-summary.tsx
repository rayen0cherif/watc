import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Skill } from "@/types";

export function SkillsSummary({ skills }: { skills: Skill[] }) {
  const top = [...skills].sort((a, b) => b.level - a.level).slice(0, 4);

  return (
    <Card>
      <CardHeader
        action={
          <Link
            href="/student/skills"
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            Détails
          </Link>
        }
      >
        <CardTitle>Progression des compétences</CardTitle>
      </CardHeader>

      <ul className="space-y-4">
        {top.map((skill) => {
          const positive = skill.trend >= 0;
          const TrendIcon = positive ? TrendingUp : TrendingDown;
          return (
            <li key={skill.id}>
              <div className="mb-1.5 flex items-center justify-between">
                <p className="text-sm font-medium text-neutral-900">{skill.name}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={
                      positive ? "flex items-center gap-1 text-accent-600" : "flex items-center gap-1 text-danger-500"
                    }
                  >
                    <TrendIcon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
                    {positive ? "+" : ""}
                    {skill.trend}%
                  </span>
                  <span className="font-semibold text-neutral-900">{skill.level}%</span>
                </div>
              </div>
              <Progress value={skill.level} tone={positive ? "accent" : "primary"} />
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
