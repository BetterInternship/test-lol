/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-22 14:37:59
 * @ Modified time: 2025-06-22 14:39:37
 * @ Description:
 *
 * Separates out the server component of the context.
 */

import { useCallback, useEffect, useState } from "react";
import { Moa } from "./db.types";
import { createClient } from "@supabase/supabase-js";

// Environment setup
const db_url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const db_anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!db_url || !db_anon_key)
  throw new Error("[ERROR:ENV] Missing supabase configuration.");
const db = createClient(db_url ?? "", db_anon_key ?? "");

/**
 * Fetches actual data from db.
 *
 * @returns
 */
export const createMoaContext = () => {
  const [moa, set_moa] = useState<Moa[]>([]);
  const [loading, set_loading] = useState(true);

  /**
   * Fetch the entire moa table.
   */
  const fetch_moa = async () => {
    const { data, error } = await db.from("moa").select("*");
    if (error) console.error(error);
    else set_moa(data);
    set_loading(false);
  };

  /**
   * Checks whether or not an association between the employer and university exists.
   *
   * @param employer_id
   * @param university_id
   */
  const check = useCallback(
    (employer_id: string, university_id: string) => {
      if (loading) return false;
      console.log(moa, employer_id, university_id);
      return moa.some(
        (m) =>
          m.employer_id === employer_id &&
          m.university_id === university_id &&
          new Date(m.expires_at ?? "").getTime() > new Date().getTime()
      );
    },
    [moa, loading]
  );

  useEffect(() => {
    fetch_moa();
  }, []);

  return {
    check,
  };
};
