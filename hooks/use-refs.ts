/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-10 04:31:46
 * @ Modified time: 2025-06-10 13:01:57
 * @ Description:
 *
 * Accesses refs directly from the database.
 */

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { College, Level, University } from "@/lib/db/db.types";

const db_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!db_url || !db_anon_key)
  throw new Error("[ERROR:ENV] Missing supabase configuration.");
const db = createClient(db_url ?? "", db_anon_key ?? "");

/**
 * Allows using the refs table we have in supabase as a hook.
 *
 * @returns
 */
export const useRefs = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  async function fetch_levels() {
    const { data, error } = await db.from("ref_levels").select("*");
    if (error) console.error(error);
    else setLevels(data as Level[]);
    return data;
  }

  async function fetch_colleges() {
    const { data, error } = await db.from("ref_colleges").select("*");
    if (error) console.error(error);
    else setColleges(data as College[]);
    return data;
  }

  async function fetch_universities() {
    const { data, error } = await db.from("ref_universities").select("*");
    if (error) console.error(error);
    else setUniversities(data as University[]);
    return data;
  }

  function get_level(id: number): Level | null {
    const f = levels.filter((l) => l.id === id);
    if (!f.length) return null;
    return f[0];
  }

  function get_level_by_name(name: string): Level | null {
    const f = levels.filter((l) => l.name === name);
    if (!f.length) return null;
    return f[0];
  }

  function get_college(id: string): College | null {
    const f = colleges.filter((c) => c.id === id);
    if (!f.length) return null;
    return f[0];
  }

  function get_college_by_name(name: string): College | null {
    const f = colleges.filter((c) => c.name === name);
    if (!f.length) return null;
    return f[0];
  }

  function get_university(id: string): University | null {
    const f = universities.filter((u) => u.id === id);
    if (!f.length) return null;
    return f[0];
  }

  function get_university_by_name(name: string): University | null {
    const f = universities.filter((u) => u.name === name);
    if (!f.length) return null;
    return f[0];
  }

  function get_university_by_domain(domain: string) {
    const f = universities.filter(
      (u) => u.domains.includes(domain) || u.domains.includes("@" + domain)
    );
    if (!f.length) return null;
    return f[0];
  }

  useEffect(() => {
    fetch_levels();
    fetch_colleges();
    fetch_universities();
  }, []);

  return {
    levels,
    colleges,
    universities,
    get_level,
    get_college,
    get_university,
    get_level_by_name,
    get_college_by_name,
    get_university_by_name,
    get_university_by_domain,
  };
};
