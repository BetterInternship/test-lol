import { useState, useEffect, useCallback, useMemo } from "react";
import {
  job_service,
  user_service,
  application_service,
  handle_api_error,
} from "@/lib/api";
import { Job, PublicUser, UserApplication, SavedJob } from "@/lib/db/db.types";
import { useAuthContext } from "@/lib/ctx-auth";
import { useCache } from "./use-cache";
import { FetchResponse } from "./use-fetch";

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
  const { get_cache_item, set_cache_item } = useCache();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load all jobs initially
  const fetchAllActiveJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await job_service.get_jobs({
        last_update:
          (get_cache_item("_jobs_last_update") as number) ??
          new Date(0).getTime(),
      });

      if (response.success) {
        if (response.jobs) {
          setJobs(response.jobs);
          set_cache_item("_jobs_last_update", new Date().getTime());
          set_cache_item("_jobs_active_list", response.jobs);
        } else setJobs(get_cache_item("_jobs_active_list") as Job[]);
      }
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllActiveJobs();
  }, [fetchAllActiveJobs]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];
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
  }, [jobs, params]);

  const getJobsPage = ({ page = 1, limit = 10 }) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return filteredJobs.slice(startIndex, endIndex);
  };

  return {
    getJobsPage,
    jobs: filteredJobs, // Expose filtered jobs for search components
    loading,
    error,
    refetch: fetchAllActiveJobs,
  };
}

// Single Job Hook
export function useJob(job_id: string | null) {
  const { is_authenticated } = useAuthContext();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // @ts-ignore
      const { job, error } = await job_service.get_job_by_id(job_id ?? "");
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }

      setJob(job);
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [job_id]);

  useEffect(() => {
    if (!job_id) {
      setLoading(false);
      return;
    }
    fetchJob();
  }, [job_id]);

  return { job, loading, error, refetch: fetchJob };
}

// User Profile Hook
export function useProfile() {
  const { is_authenticated } = useAuthContext();
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await user_service.get_my_profile();
      if (user) setProfile(user as PublicUser);
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (is_authenticated()) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const updateProfile = async (data: Partial<PublicUser>) => {
    try {
      setError(null);
      const { user } = await user_service.update_my_profile(data);
      if (user) setProfile(user as PublicUser);
      return user;
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetch: fetchProfile,
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
  const cache_key = `__${name}__cache`;
  const { get_cache_item, set_cache_item } = useCache();
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
        if (!get_cache_item(cache_key)) set_cache_item(cache_key, []);
        const new_data = [
          ...(get_cache_item(cache_key) as T[]),
          { ...added_data },
        ] as T[];
        set_cache_item(cache_key, new_data);
        setData(new_data);

        // We unadded an item, for toggle routes
      } else if (response.success) {
        console.log("[DBLISTHOOK] Toggling off; table " + name);
        const new_data = (get_cache_item(cache_key) as T[]).filter(
          (old_data) => old_data.id !== id
        );
        set_cache_item(cache_key, new_data);
        setData(new_data);
      }
      return response;
    } catch (error) {
      handle_api_error(error);
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
      const cache_data = get_cache_item(cache_key) as T[];
      if (cache_data) {
        setData(cache_data);
        return;
      }

      // Otherwise, pull from server
      const response = await fetches.get_data();
      const gotten_data = (response.data as T[]) ?? [];

      if (response.success) {
        setData(gotten_data);
        set_cache_item(cache_key, gotten_data);
      }
    } catch (err) {
      setError(handle_api_error(err));
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
    await job_service.get_saved_jobs().then((r) => ({ ...r, data: r.jobs }));
  const add_data = async (id: string) =>
    await user_service.save_job(id).then((r) => ({ ...r, data: r.job }));

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

// Saved Jobs Hook
export function useApplications() {
  const { is_authenticated, recheck_authentication } = useAuthContext();
  const { get_cache_item, set_cache_item } = useCache();
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<Partial<Job>[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAppliedJobs(
      applications.map((application) => ({ id: application.job_id ?? "" }))
    );
  }, [applications]);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached_applications = get_cache_item(
        "_applications_list"
      ) as UserApplication[];
      if (cached_applications) {
        await setTimeout(() => {}, 500);
        setApplications(cached_applications);
        return;
      }

      // Otherwise, pull from server
      const response = await application_service.get_applications();
      if (response.success) {
        setApplications(response.applications ?? []);
        set_cache_item("_applications_list", response.applications ?? []);
      }
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const apply = async (job_id: string) => {
    try {
      const response = await application_service.create_application({
        job_id,
      });

      if (response.application) {
        if (!get_cache_item("_applications_list"))
          set_cache_item("_applications_list", []);
        const new_applications = [
          ...(get_cache_item("_applications_list") as UserApplication[]),
          { ...response.application },
        ] as UserApplication[];
        set_cache_item("_applications_list", new_applications);
        setApplications(new_applications);
      }

      return response;
    } catch (error) {
      handle_api_error(error);
      throw error;
    }
  };

  useEffect(() => {
    recheck_authentication().then((r) =>
      r ? fetchApplications() : setLoading(false)
    );
  }, [fetchApplications]);

  const is_applied = (job_id: string): boolean => {
    return applications.some((application) => application.id === job_id);
  };

  return {
    apply,
    applications,
    loading,
    applying,
    error,
    is_applied,
    appliedJobs,
    appliedJob: (job_id: string) =>
      appliedJobs.map((aj) => aj.id).includes(job_id),
    refetch: fetchApplications,
  };
}
