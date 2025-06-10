import { useState, useEffect, useCallback, useMemo } from "react";
import { job_service, handle_api_error } from "@/lib/api";
import { Job } from "@/lib/db/db.types";
import { useAuthContext } from "@/app/hire/authctx";
import { useCache } from "./use-cache";

/**
 * Hook for dealing with jobs owned by employer.
 * @returns
 */
export function useOwnedJobs(
  params: {
    category?: string;
    type?: string;
    mode?: string;
    search?: string;
    location?: string;
    industry?: string;
  } = {}
) {
  const { is_authenticated, recheck_authentication } = useAuthContext();
  const { get_cache_item, set_cache_item } = useCache();
  const [ownedJobs, setOwnedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached_saved_jobs = get_cache_item("_jobs_owned_list") as Job[];
      if (cached_saved_jobs) {
        await setTimeout(() => {}, 500);
        setOwnedJobs(cached_saved_jobs);
        return;
      }

      // Otherwise, pull from server
      const response = await job_service.get_owned_jobs();
      if (response.success) {
        setOwnedJobs(response.jobs ?? []);
        set_cache_item("_jobs_owned_list", response.jobs ?? []);
      }
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const update_job = async (job_id: string, job: Partial<Job>) => {
    const response = await job_service.update_job(job_id, job);
    if (response.success) {
      const job = response.job;
      set_cache_item("_jobs_owned_list", [
        job,
        ...ownedJobs.filter((oj) => oj.id !== job.id),
      ]);
      setOwnedJobs(get_cache_item("_jobs_owned_list") as Job[]);
    }
    return response;
  };

  useEffect(() => {
    recheck_authentication().then((r) =>
      r ? fetchOwnedJobs() : setLoading(false)
    );
  }, [fetchOwnedJobs]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    let filtered = [...ownedJobs];
    const { type, mode, search, location, industry } = params;

    // Apply type filter
    if (type && type !== "All types") {
      filtered = filtered.filter((job) => {
        if (type === "Internships") return job.type === 0;
        if (type === "Full-time") return job.type === 1;
        if (type === "Part-time") return job.type === 2;
        return false;
      });
    }

    // Apply mode filter
    if (mode && mode !== "Any location") {
      filtered = filtered.filter((job) => {
        if (mode === "In-Person") return job.mode === 0;
        return job.mode === 1 || job.mode === 2;
      });
    }

    // Apply industry filter
    if (industry && industry !== "All industries") {
      filtered = filtered.filter((job) => {
        return job.employer?.industry
          ?.toLowerCase()
          .includes(industry.toLowerCase());
      });
    }

    // Apply search filter
    if (search && search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filtered = filtered.filter((job) => {
        // Search in multiple fields
        const searchableText = [
          job.title,
          job.description,
          job.employer?.name,
          job.employer?.industry,
          job.location,
          ...(job.keywords || []),
          ...(job.requirements || []),
          ...(job.responsibilities || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchLower);
      });
    }

    // Apply location filter
    if (location && location.trim()) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    return filtered;
  }, [ownedJobs, params]);

  return {
    ownedJobs: filteredJobs,
    update_job,
    loading,
    error,
    refetch: fetchOwnedJobs,
  };
}
