/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 18:04:08
 * @ Modified time: 2025-06-24 05:06:07
 * @ Description:
 *
 * Feature for abstracting fetches on component mount.
 */

import { useCache } from "@/hooks/use-cache";
import { v5 as uuidv5 } from "uuid";

// Grab the key for hashing the cache names
const CACHE_KEY = process.env.NEXT_PUBLIC_CACHE_KEY;
if (!CACHE_KEY) console.error("Cache key is missing.");

// All responses from the BetterInternship API server will extend this interface
export interface FetchResponse {
  success?: boolean;
  message?: string;
}

/**
 * Creates a fetch function that checks whether or not the results are cached first.
 *
 *
 * @param id      Refers to how we index the cached values in sessionStorage.
 * @param fetcher The async function that performs the fetching.
 * @returns
 */
export const create_cached_fetcher = <T>(
  id: string,
  fetcher: () => Promise<T | null | undefined>
) => {
  const hash = uuidv5(id, process.env.NEXT_PUBLIC_CACHE_KEY ?? "");
  const { get_cache, set_cache, del_cache } = useCache<T>(hash);

  return {
    do_fetch: async (): Promise<T | null> => {
      if (get_cache()) return get_cache();
      const data = await fetcher();
      if (!data) return null;
      set_cache(data);
      return data;
    },
    do_clear: () => del_cache(),
  };
};
