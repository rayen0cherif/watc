export type Role = "student" | "supervisor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  onboardingComplete?: boolean;
}

export interface StudentProfile extends User {
  role: "student";
  level: "L3" | "M1" | "M2" | "Ingénierie";
  specialty: string;
}

export interface SupervisorProfile extends User {
  role: "supervisor";
  department?: string;
  title?: string;
}
