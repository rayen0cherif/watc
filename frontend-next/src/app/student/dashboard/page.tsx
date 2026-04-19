import { HeroWidget } from "@/components/dashboard/hero-widget";
import { TimelineCard } from "@/components/dashboard/timeline-card";
import { JournalCard } from "@/components/dashboard/journal-card";
import { AiWidget } from "@/components/dashboard/ai-widget";
import { SkillsSummary } from "@/components/dashboard/skills-summary";
import { MentorsCard } from "@/components/dashboard/mentors-card";
import { UpcomingCard } from "@/components/dashboard/upcoming-card";
import { fetchCurrentPFE } from "@/lib/api/pfe";
import { fetchMeetings } from "@/lib/api/tracking";
import { fetchSkills } from "@/lib/api/skills";
import { mockStudent } from "@/data/mocks";
import type { Milestone } from "@/types";

export default async function StudentDashboardPage() {
  const [project, meetings, skills] = await Promise.all([
    fetchCurrentPFE(),
    fetchMeetings(),
    fetchSkills(),
  ]);

  const upcomingMilestone = project.milestones.find(
    (m: Milestone) => m.status === "in_progress" || m.status === "todo",
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <HeroWidget
        studentName={mockStudent.name}
        project={project}
        upcomingMilestoneLabel={upcomingMilestone?.title}
        upcomingMilestoneDate={upcomingMilestone?.dueDate}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <TimelineCard milestones={project.milestones} />
          <AiWidget />
          <JournalCard entries={project.journal} />
        </div>

        <div className="flex flex-col gap-6">
          <UpcomingCard meetings={meetings} />
          <SkillsSummary skills={skills} />
          <MentorsCard mentors={project.mentors} />
        </div>
      </div>
    </div>
  );
}
