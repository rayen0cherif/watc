import type { Feedback, Meeting, Task, TaskStatus } from "@/types";
import { mockFeedback, mockMeetings, mockTasks } from "@/data/mocks";
import { delay } from "./client";

// TODO(backend): GET /api/student/tasks
export function fetchTasks(): Promise<Task[]> {
  return delay(mockTasks);
}

// TODO(backend): PATCH /api/student/tasks/:id
export function updateTaskStatus(id: string, status: TaskStatus): Promise<{ id: string; status: TaskStatus }> {
  return delay({ id, status });
}

// TODO(backend): GET /api/student/meetings
export function fetchMeetings(): Promise<Meeting[]> {
  return delay(mockMeetings);
}

// TODO(backend): GET /api/student/feedback
export function fetchFeedback(): Promise<Feedback[]> {
  return delay(mockFeedback);
}
