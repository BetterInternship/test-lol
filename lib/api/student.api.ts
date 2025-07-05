import { useState, useEffect, useCallback, useMemo } from "react";
import {
  JobService,
  UserService,
  ApplicationService,
  handleApiError,
} from "@/lib/api/services";
import { Job, PublicUser, UserApplication } from "@/lib/db/db.types";
import { useAuthContext } from "@/lib/ctx-auth";
import { useCache } from "../../hooks/use-cache";
import { create_cached_fetcher, FetchResponse } from "./use-fetch";
import { useRefs } from "../db/use-refs";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
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
 * Makes life easier
 *
 * @hook
 * @internal
 */
const listFromDBInternalHook = <
  ID extends number | string,
  T extends { id?: ID }
>({
  name,
  fetches,
}: {
  name: string;
  fetches: {
    get_data: () => Promise<{ data?: T[] } & FetchResponse>;
    add_data?: (
      id: ID,
      new_data: Partial<T>
    ) => Promise<{ data?: T } & FetchResponse>;
    set_data?: (
      id: ID,
      new_data: Partial<T>
    ) => Promise<{ data?: T } & FetchResponse>;
  };
}) => {
  const { get_cache, set_cache } = useCache<T[]>(`__${name}__cache`);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /**
   * Adds an item to the list.
   */
  const add_data = useCallback(async (id: ID, new_data: Partial<T>) => {
    if (!fetches.add_data) return;

    try {
      setUpdating(true);
      const response = await fetches.add_data(id, new_data);
      const added_data = response.data as T;

      // We added an item
      if (added_data) {
        console.log("[DBLISTHOOK] Toggling on; table " + name);
        if (!get_cache()) set_cache([]);
        const new_data = [...(get_cache() as T[]), { ...added_data }] as T[];
        set_cache(new_data);
        setData(new_data);

        // We unadded an item, for toggle routes
      } else if (response.success) {
        console.log("[DBLISTHOOK] Toggling off; table " + name);
        const new_data = (get_cache() as T[]).filter(
          (old_data) => old_data.id !== id
        );
        set_cache(new_data);
        setData(new_data);
      }
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    } finally {
      setUpdating(false);
    }
  }, []);

  /**
   * Syncs up list with the db.
   */
  const get_data = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Check cache first
      const cache_data = get_cache() as T[];
      if (cache_data) {
        setData(cache_data);
        return;
      }

      // Otherwise, pull from server
      const response = await fetches.get_data();
      const gotten_data = (response.data as T[]) ?? [];

      if (response.success) {
        setData(gotten_data);
        set_cache(gotten_data);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    get_data();
  }, [get_data]);

  return {
    data,
    error,
    loading,
    updating,
    add: add_data,
    refetch: get_data,
  };
};

/**
 * Saved jobs hook
 *
 * @hook
 */
export const useSavedJobs = () => {
  // Mapping of fetch outputs
  const get_data = async () =>
    await JobService.get_saved_jobs().then((r) => ({ ...r, data: r.jobs }));
  const add_data = async (id: string) =>
    await UserService.saveJob(id).then((r) => ({ ...r, data: r.job }));

  // Makes our lives easier
  const {
    data: saved_jobs,
    error,
    loading,
    add: save_job,
    updating: saving,
    refetch,
  } = listFromDBInternalHook<string, Job>({
    name: "saved_jobs",
    fetches: {
      get_data,
      add_data,
    },
  });

  // Other utils
  const is_saved = (job_id: string): boolean => {
    return saved_jobs.some((saved_job) => saved_job.id === job_id);
  };

  return {
    save_job: (job_id: string) => save_job(job_id, {}),
    saved_jobs,
    loading,
    saving,
    error,
    is_saved: is_saved,
    refetch: refetch,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
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
