import { Database as _Database, Tables } from "./db.base-types.js";

export type Database = _Database;
export type Level = Tables<"ref_levels">;
export type College = Tables<"ref_colleges">;
export type University = Tables<"ref_universities">;
export type JobType = Tables<"ref_job_types">;
export type JobAllowance = Tables<"ref_job_allowances">;
export type JobPayFreq = Tables<"ref_job_pay_freq">;
export type JobMode = Tables<"ref_job_modes">;
export type PrivateUser = Tables<"users">; // Has all fields accessible
export type PublicUser = Omit<Tables<"users">, "verification_hash"> & {
  // Additional profile fields
  year_level?: string | number;
  college?: string | number;
  portfolio_link?: string;
  github_link?: string;
  linkedin_link?: string;
  full_name?: string;
  phone_number?: string;
}; // Hidden private fields
export type Employer = Partial<Tables<"employers">>;
export type PublicEmployerUser = Omit<Tables<"employers">, "verification_hash">; // Employer user type
export interface Job extends Partial<Tables<"jobs">> {
  employer?: Partial<Employer>;
  employers?: Partial<Employer>;
}

export interface Application extends Partial<Tables<"applications">> {
  job?: Partial<Job>;
  jobs?: Partial<Job>;
  employer?: Partial<Employer>;
  employers?: Partial<Employer>;
}

export interface SavedJob extends Partial<Tables<"saved_jobs">> {
  job?: Partial<Job>;
  jobs?: Partial<Job>;
}
