export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  milestone: string;
  dueDate: string;
}

export interface Meeting {
  id: string;
  title: string;
  scheduledAt: string;
  mentorName: string;
  mentorInitials: string;
}

export interface Feedback {
  id: string;
  mentorName: string;
  mentorInitials: string;
  postedAt: string;
  body: string;
}
