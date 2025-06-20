/**
 * @ Author: Mo David
 * @ Create Time: 2025-06-19 06:01:21
 * @ Modified time: 2025-06-19 18:17:19
 * @ Description:
 *
 * Properly handles dealing with files stored in GCS and their local state.
 * Synchronizes the hash for caching and shit.
 */

import { useCallback, useState } from "react";

interface IUseFile {
  url: string;
  sync: () => Promise<void>;
}

/**
 * Synchronizes a gcs-stored file's state with the server's.
 *
 * @hook
 */
export const useFile = ({
  route,
  fetch,
}: {
  route: string;
  fetch: () => Promise<any>;
}): IUseFile => {
  const [url, setUrl] = useState("");

  /**
   * Performs a sync by requesting for the hash of the file from the server.
   * It will then use this hash to request the file each time.
   *
   * @returns
   */
  const synchronize = useCallback(async () => {
    const { success, hash } = await fetch();

    // Something went wrong
    if (!success) {
      console.error("Could not fetch file.");
      return;
    }

    // Update url
    setUrl(`${process.env.NEXT_PUBLIC_API_URL}${route}?hash=${hash}`);
  }, [route]);

  return {
    url,
    sync: synchronize,
  };
};
