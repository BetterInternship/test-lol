/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-15 03:09:57
 * @ Modified time: 2025-06-15 18:14:22
 * @ Description:
 *
 * The actual backend connection to provide the refs data
 */

import { useState, useEffect, useCallback } from "react";
import {
  Level,
  College,
  University,
  JobType,
  JobMode,
  JobAllowance,
  JobPayFreq,
} from "./db.types";
import { createClient } from "@supabase/supabase-js";

// Environment setup
const db_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!db_url || !db_anon_key)
  throw new Error("[ERROR:ENV] Missing supabase configuration.");
const db = createClient(db_url ?? "", db_anon_key ?? "");

// Setup the context
export interface IRefsContext {
  ref_loading: boolean;

  levels: Level[];
  colleges: College[];
  universities: University[];
  job_types: JobType[];
  job_modes: JobMode[];
  job_allowances: JobAllowance[];
  job_pay_freq: JobPayFreq[];

  get_level: (id: number) => Level | null;
  get_college: (id: string) => College | null;
  get_university: (id: string) => University | null;
  get_job_type: (id: number) => JobType | null;
  get_job_mode: (id: number) => JobMode | null;
  get_job_allowance: (id: number) => JobAllowance | null;
  get_job_pay_freq: (id: number) => JobPayFreq | null;

  get_level_by_name: (name: string) => Level | null;
  get_college_by_name: (name: string) => College | null;
  get_university_by_name: (name: string) => University | null;
  get_university_by_domain: (name: string) => University | null;
  get_job_type_by_name: (name: string) => JobType | null;
  get_job_mode_by_name: (name: string) => JobMode | null;
  get_job_allowance_by_name: (name: string) => JobAllowance | null;
  get_job_pay_freq_by_name: (name: string) => JobPayFreq | null;
}

/**
 * A utility that allows us to create ref hooks from our reference tables.
 *
 * @param table
 * @returns
 */
const createRefInternalHook = <
  ID extends string | number,
  T extends { id: ID; name: string }
>(
  table: string
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the data from the backend.
   */
  async function fetchData() {
    setLoading(true);
    const { data, error } = await db.from(table).select("*");
    if (error) console.error(error);
    else setData(data);
    setLoading(false);
  }

  /**
   * Gets a ref by id
   *
   * @param id
   * @returns
   */
  const get = useCallback(
    (id: ID): T | null => {
      const f = data?.filter((d) => d.id === id);
      if (!f.length) return null;
      return f[0];
    },
    [data]
  );

  /**
   * Gets a ref by name
   *
   * @param name
   * @returns
   */
  const get_by_name = useCallback(
    (name: string): T | null => {
      const f = data?.filter((d) => d.name === name);
      if (!f.length) return null;
      return f[0];
    },
    [data]
  );

  // Fetch the data at the start
  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    get,
    get_by_name,
    loading,
  };
};

export const useRefsContext = () => {
  const [loading, setLoading] = useState(true);
  const {
    data: levels,
    get: get_level,
    get_by_name: get_level_by_name,
    loading: l1,
  } = createRefInternalHook<number, Level>("ref_levels");

  const {
    data: colleges,
    get: get_college,
    get_by_name: get_college_by_name,
    loading: l2,
  } = createRefInternalHook<string, College>("ref_colleges");

  const {
    data: universities,
    get: get_university,
    get_by_name: get_university_by_name,
    loading: l3,
  } = createRefInternalHook<string, University>("ref_universities");

  const {
    data: job_types,
    get: get_job_type,
    get_by_name: get_job_type_by_name,
    loading: l4,
  } = createRefInternalHook<number, JobType>("ref_job_types");

  const {
    data: job_modes,
    get: get_job_mode,
    get_by_name: get_job_mode_by_name,
    loading: l5,
  } = createRefInternalHook<number, JobMode>("ref_job_modes");

  const {
    data: job_allowances,
    get: get_job_allowance,
    get_by_name: get_job_allowance_by_name,
    loading: l6,
  } = createRefInternalHook<number, JobAllowance>("ref_job_allowances");

  const {
    data: job_pay_freq,
    get: get_job_pay_freq,
    get_by_name: get_job_pay_freq_by_name,
    loading: l7,
  } = createRefInternalHook<number, JobPayFreq>("ref_job_pay_freq");

  useEffect(() => {
    setLoading(l1 || l2 || l3 || l4 || l5 || l6 || l7);
  }, [l1, l2, l3, l4, l5, l6, l7]);

  /**
   * An additional helper for grabbing uni from email
   *
   * @param domain
   * @returns
   */
  function get_university_by_domain(domain: string) {
    const f = universities.filter(
      (u) => u.domains.includes(domain) || u.domains.includes("@" + domain)
    );
    if (!f.length) return null;
    return f[0];
  }

  // The API to provide to the app
  const refs_context = {
    ref_loading: loading,

    levels,
    colleges,
    universities,
    job_types,
    job_modes,
    job_allowances,
    job_pay_freq,

    get_level,
    get_college,
    get_university,
    get_job_type,
    get_job_mode,
    get_job_allowance,
    get_job_pay_freq,

    get_level_by_name,
    get_college_by_name,
    get_university_by_name,
    get_university_by_domain,
    get_job_type_by_name,
    get_job_mode_by_name,
    get_job_allowance_by_name,
    get_job_pay_freq_by_name,
  };

  return refs_context;
};
