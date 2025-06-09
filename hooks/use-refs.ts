/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-10 04:31:46
 * @ Modified time: 2025-06-10 05:00:19
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
    console.log(data);
    if (error) console.error(error);
    else setLevels(data as Level[]);
  }

  async function fetch_colleges() {
    const { data, error } = await db.from("ref_colleges").select("*");
    if (error) console.error(error);
    else setColleges(data as College[]);
  }

  async function fetch_universities() {
    const { data, error } = await db.from("ref_universities").select("*");
    if (error) console.error(error);
    else setUniversities(data as University[]);
  }

  useEffect(() => {
    fetch_levels();
    fetch_colleges();
    fetch_universities();
  }, []);

  return { levels, colleges, universities };
};
