import { Database as _Database, Tables } from "./db.base-types.js";

export type Database = _Database;
export type PrivateUser = Tables<"users">; // Has all fields accessible
export type PublicUser = Omit<Tables<"users">, "verification_hash">; // Hidden private fields
export type Employer = Partial<Tables<"employers">>;
export type PrivateEmployerUser = Tables<"employer_users">;
export type PublicEmployerUser = Omit<Tables<"employer_users">, "is_god">;
export type Application = Partial<Tables<"applications">>;
export interface Job extends Partial<Tables<"jobs">> {
  employer?: Partial<Employer>;
  employers?: Partial<Employer>;
}

export interface SavedJob extends Partial<Tables<"saved_jobs">> {
  job?: Partial<Job>;
  jobs?: Partial<Job>;
}
