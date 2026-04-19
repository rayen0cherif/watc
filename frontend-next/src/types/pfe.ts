export type MilestoneStatus = "done" | "in_progress" | "blocked" | "todo";

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: MilestoneStatus;
}

export type DeliverableStatus = "validated" | "in_review" | "in_progress" | "todo";

export interface Deliverable {
  id: string;
  name: string;
  format: string;
  dueDate: string;
  status: DeliverableStatus;
}

export interface JournalEntry {
  id: string;
  date: string;
  summary: string;
  blockers: string;
  nextStep: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: "academic" | "professional";
  title: string;
  organization: string;
  avatarInitials: string;
}

export interface PFEProject {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  startDate: string;
  endDate: string;
  defenseDate: string;
  progress: number;
  status: "in_progress" | "submitted" | "defended";
  company: {
    name: string;
    address: string;
  };
  university: string;
  milestones: Milestone[];
  deliverables: Deliverable[];
  mentors: Mentor[];
  journal: JournalEntry[];
}
