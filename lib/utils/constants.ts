import { SupabaseEnums } from "@/types";

export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];
export const ALLOWED_FILE_EXTENSIONS_STRING = ".pdf, .jpeg, .jpg, .png";

export const MOCK_COMPANIES = [
  "Tech Solutions Inc.",
  "Innovatech Ltd.",
  "Future Systems Co.",
  "Data Wizards LLC",
  "CyberPro Corp.",
] as const;
export const ACADEMIC_YEARS = [
  "2023-2024",
  "2024-2025",
  "2025-2026",
  "2026-2027",
] as const;
export const DEPARTMENTS = [
  "College of Computer Studies",
  "College of Business and Accountancy",
  "College of Engineering",
  "College of Arts and Sciences",
  "College of Education",
] as const;
