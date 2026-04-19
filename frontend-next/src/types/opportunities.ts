export type ContractType = "internship" | "apprenticeship" | "cdd" | "cdi" | "freelance";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  contractType: ContractType;
  matchScore: number;
  skills: string[];
  urgent: boolean;
  url: string;
}
