import { useState, useEffect, useCallback, useMemo } from "react";
import {
  JobService,
  UserService,
  ApplicationService,
  handleApiError,
} from "@/lib/api/services";
import { Job } from "@/lib/db/db.types";
import { create_cached_fetcher } from "./use-fetch";
import { useRefs } from "@/lib/db/use-refs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Jobs Hook with Client-Side Filtering
export function useJobs(
  params: {
    category?: string;
    type?: string;
    mode?: string;
    search?: string;
    location?: string;
    industry?: string;
  } = {}
) {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get_job_category_by_name } = useRefs();

  // ! make sure last update depends on last update sent by server (should be a cookie instead, dont let client handle it on its own)
  const fetcher = async () => {
    const response = await JobService.get_jobs({
      last_update: new Date(0).getTime(),
    });
    if (!response.success) setError(response.message ?? "");
    return response.jobs;
  };
  const { do_fetch: fetch_all_active_jobs } = create_cached_fetcher<Job[]>(
    "active-jobs",
    fetcher
  );

  // Load all jobs initially
  const fetchAllActiveJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobs = await fetch_all_active_jobs();
      if (jobs) setAllJobs(jobs);
      else setError("Could not load jobs.");
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActiveJobs();
  }, [fetchAllActiveJobs]);

  // Client-side filtering logic
  const filteredJobs = useMemo(() => {
    if (!allJobs.length) return [];

    return allJobs.filter((job) => {
      // Search filter
      if (params.search?.trim()) {
        const searchTerm = params.search.toLowerCase();
        const searchableText = [
          job.title,
          job.description,
          job.employer?.name,
          job.employer?.industry,
          job.location,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      // Industry filter (through employer.industry)
      if (
        params.industry &&
        !params.industry.toLowerCase().includes("all") &&
        !params.industry.toLowerCase().includes("industries")
      ) {
        const jobIndustry = job.employer?.industry?.toLowerCase();
        const filterIndustry = params.industry.toLowerCase();

        // Handle partial matches for industry names
        if (
          !jobIndustry?.includes(filterIndustry) &&
          !filterIndustry.includes(jobIndustry || "")
        ) {
          return false;
        }
      }

      // Category filter - Improved logic with better keyword matching and potential field matching
      if (
        params.category &&
        !params.category.toLowerCase().includes("all") &&
        !params.category.toLowerCase().includes("categories")
      ) {
        const category_id = get_job_category_by_name(params.category)?.id;
        // @ts-ignore
        return category_id === job.category;
      }

      // Job type filter
      if (
        params.type &&
        !params.type.toLowerCase().includes("all") &&
        !params.type.toLowerCase().includes("types")
      ) {
        // Map filter values to job type values
        const typeMapping: { [key: string]: number } = {
          Internships: 0,
          "Part-time": 1,
          "Full-time": 2,
        };

        const expectedType = typeMapping[params.type];
        if (expectedType !== undefined && job.type !== expectedType)
          return false;
      }

      // Location/Mode filter
      if (
        params.mode &&
        !params.mode.toLowerCase().includes("any") &&
        !params.mode.toLowerCase().includes("location")
      ) {
        // Map filter values to job mode values
        const modeMapping: { [key: string]: number } = {
          "In-Person": 0,
          Remote: 1,
          Hybrid: 2,
        };

        const expectedMode = modeMapping[params.mode];
        if (expectedMode !== undefined && job.mode !== expectedMode)
          return false;
      }

      return true;
    });
  }, [allJobs, params]);

  const getJobsPage = useCallback(
    ({ page = 1, limit = 10 }) => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return filteredJobs.slice(startIndex, endIndex);
    },
    [filteredJobs]
  );

  return {
    getJobsPage,
    jobs: filteredJobs, // Return filtered jobs
    allJobs, // Also expose unfiltered jobs for total count
    loading,
    error,
    refetch: fetchAllActiveJobs,
  };
}

/**
 * Requests information about a single job.
 *
 * @hook
 * @param jobId
 */
export function useJob(jobId: string) {
  const { isPending, data, error } = useQuery({
    queryKey: ["jobs", jobId],
    queryFn: async () => await JobService.getJobById(jobId),
  });

  return { isPending, data: data?.job ?? null, error };
}

/**
 * Requests profile information and allows profile updates.
 *
 * @hook
 */
export function useProfile() {
  const queryClient = useQueryClient();
  const { isPending, data, error } = useQuery({
    queryKey: ["my-profile"],
    queryFn: UserService.getMyProfile,
  });
  const {
    isPending: isUpdating,
    error: updateError,
    mutateAsync: update,
  } = useMutation({
    mutationFn: UserService.updateMyProfile,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["my-profile"] }),
  });

  return {
    data: data?.user ?? null,
    error,
    update,
    updateError,
    isPending,
    isUpdating,
  };
}

/**
 * Saved jobs hook
 *
 * @hook
 */
export const useSavedJobs = () => {
  const queryClient = useQueryClient();
  const { isPending, data, error } = useQuery({
    queryKey: ["my-saved-jobs"],
    queryFn: JobService.getSavedJobs,
  });
  const { isPending: isToggling, mutate: toggle } = useMutation({
    mutationFn: UserService.saveJob,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["my-saved-jobs"] }),
  });

  // Other utils
  const isJobSaved = (jobId: string): boolean => {
    return data?.jobs?.some((savedJob) => savedJob.id === jobId) ?? false;
  };

  return {
    data: data?.jobs,
    error,
    toggle,
    isPending,
    isToggling,
    isJobSaved,
  };
};

/**
 * Hooks for saved jobs.
 *
 * @hook
 */
export function useApplications() {
  const queryClient = useQueryClient();
  const { isPending, data, error } = useQuery({
    queryKey: ["my-applications"],
    queryFn: () => ApplicationService.getApplications(),
  });
  const {
    isPending: isCreating,
    error: createError,
    mutateAsync: create,
  } = useMutation({
    mutationFn: ApplicationService.createApplication,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["my-applications"] }),
  });

  // Save appliedJobs independently
  const [appliedJobs, setAppliedJobs] = useState<Partial<Job>[]>([]);
  useEffect(() => {
    setAppliedJobs(
      data?.applications.map((application) => ({
        id: application.job_id ?? "",
      })) ?? []
    );
  }, [data]);

  // Checks if user has applied to job
  const hasAppliedToJob = (jobId: string): boolean => {
    return (
      data?.applications.some((application) => application.id === jobId) ??
      false
    );
  };

  return {
    isPending,
    isCreating,
    data: data?.applications ?? [],
    create,
    error,
    createError,
    hasAppliedToJob,
    appliedJobs,
    appliedJob: (job_id: string) =>
      appliedJobs.map((aj) => aj.id).includes(job_id),
  };
}
