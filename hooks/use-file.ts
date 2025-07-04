/**
 * @ Author: Mo David
 * @ Create Time: 2025-06-19 06:01:21
 * @ Modified time: 2025-07-04 16:00:52
 * @ Description:
 *
 * Properly handles dealing with files stored in GCS and their local state.
 * Synchronizes the hash for caching and shit.
 */

import { useCallback, useState } from "react";

interface IUseFile {
  url: string;
  loading: boolean;
  sync: () => Promise<void>;
}

/**
 * Synchronizes a gcs-stored file's state with the server's.
 *
 * @hook
 */
export const useFile = ({
  route,
  fetcher,
  defaultUrl = "",
}: {
  route: string;
  fetcher: () => Promise<any>;
  defaultUrl?: string;
}): IUseFile => {
  const [url, setUrl] = useState(defaultUrl);
  const [loading, setLoading] = useState(true);

  /**
   * Performs a sync by requesting for the hash of the file from the server.
   * It will then use this hash to request the file each time.
   *
   * @returns
   */
  const synchronize = useCallback(async () => {
    const { success, empty, hash } = await fetcher();

    // Something went wrong
    if (!success) {
      console.error("Could not fetch file.");
      setLoading(false);
      return;
    }

    // File has not been uploaded by host / source
    if (empty) {
      setLoading(false);
      return;
    }

    // Update url
    setUrl(`${process.env.NEXT_PUBLIC_API_URL}${route}?hash=${hash}`);
    setLoading(false);
  }, [route]);

  return {
    url,
    loading,
    sync: synchronize,
  };
};
