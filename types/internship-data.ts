import { ACADEMIC_YEARS, DEPARTMENTS, MOCK_COMPANIES } from "@/lib/utils";

export type JobMode = "Remote" | "In-Person" | "Hybrid";
export type Decision = "Accepted" | "Rejected" | "Pending" | "Offer Received";

export interface HiringData {
  id: string;
  studentName: string;
  program: string; // e.g., BS Computer Science
  companyName: string;
  jobTitle: string;
  jobPosition: string; // e.g., Intern, Junior Developer
  jobPay?: number; // Optional, can be string like "Competitive" or number
  jobMode: JobMode;
  jobLink?: string; // URL
  applicationDate: string; // ISO Date string
  decisionDate?: string; // ISO Date string
  decision: Decision;
  moaSubmissionDate?: string; // ISO Date string
  jobDescriptionSubmissionDate?: string; // ISO Date string
}

export interface WeeklyFeedback {
  weekNumber: number;
  feedbackText: string;
}

export interface FeedbackData {
  id: string;
  studentName: string;
  program: string;
  startDateOfInternship: string; // ISO Date string
  overallFeedback: string;
  tasksCompleted: string; // Could be a list or a long text
  lessonsLearned: string;
  areaOfImprovement: string;
  weeklyFeedbacks: WeeklyFeedback[]; // For week1 to week12
}

export interface CompanyStudentInfo {
  id: string;
  name: string;
}

export interface CompanyData {
  id: string;
  companyName: string;
  address: string;
  phone?: string;
  moaDate?: string; // ISO Date string
  contactPersonName: string;
  contactPersonPhone?: string;
  contactPersonPosition: string;
  activeStudents: CompanyStudentInfo[];
  pastStudents: CompanyStudentInfo[];
  studentRating?: number; // e.g., 1-5 scale
}

// For filters

export type Department = (typeof DEPARTMENTS)[number];

export type AcademicYear = (typeof ACADEMIC_YEARS)[number];

export type CompanyName = (typeof MOCK_COMPANIES)[number];

export type InternshipDataView = "hiring" | "feedback" | "companies";

export interface InternshipDataTableProps {
  initialHiringData: HiringData[];
  initialFeedbackData: FeedbackData[];
  initialCompanyData: CompanyData[];
  availableDepartments: readonly Department[];
  availableCompanies: readonly CompanyName[];
  availableAcademicYears: readonly AcademicYear[];
}
