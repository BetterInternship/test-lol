import { useState, useEffect, useCallback, useMemo } from "react";
import {
  job_service,
  user_service,
  application_service,
  handle_api_error,
} from "@/lib/api/api";
import { Job, PublicUser, UserApplication } from "@/lib/db/db.types";
import { useAuthContext } from "@/lib/ctx-auth";
import { useCache } from "../../hooks/use-cache";
import { create_cached_fetcher, FetchResponse } from "./use-fetch";

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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ! make sure last update depends on last update sent by server (should be a cookie instead, dont let client handle it on its own)
  const fetcher = async () => {
    const response = await job_service.get_jobs({
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
      if (jobs) setJobs(jobs);
      else setError("Could not load jobs.");
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

  const getJobsPage = ({ page = 1, limit = 10 }) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return jobs.slice(startIndex, endIndex);
  };

  return {
    getJobsPage,
    jobs: jobs, // Expose filtered jobs for search components
    loading,
    error,
    refetch: fetchAllActiveJobs,
  };
}

// Single Job Hook
export function useJob(job_id: string | null) {
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
  const { get, set } = useCache<T[]>();
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
        if (!get(cache_key)) set(cache_key, []);
        const new_data = [...(get(cache_key) as T[]), { ...added_data }] as T[];
        set(cache_key, new_data);
        setData(new_data);

        // We unadded an item, for toggle routes
      } else if (response.success) {
        console.log("[DBLISTHOOK] Toggling off; table " + name);
        const new_data = (get(cache_key) as T[]).filter(
          (old_data) => old_data.id !== id
        );
        set(cache_key, new_data);
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
      const cache_data = get(cache_key) as T[];
      if (cache_data) {
        setData(cache_data);
        return;
      }

      // Otherwise, pull from server
      const response = await fetches.get_data();
      const gotten_data = (response.data as T[]) ?? [];

      if (response.success) {
        setData(gotten_data);
        set(cache_key, gotten_data);
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
  const { get, set } = useCache<UserApplication[]>();
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
      const cached_applications = get(
        "_applications_list"
      ) as UserApplication[];
      if (cached_applications) {
        setApplications(cached_applications);
        return;
      }

      // Otherwise, pull from server
      const response = await application_service.get_applications();
      if (response.success) {
        setApplications(applications);
        set("_applications_list", applications);
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
        if (!get("_applications_list")) set("_applications_list", []);
        const new_applications = [
          ...(get("_applications_list") as UserApplication[]),
          { ...response.application },
        ] as UserApplication[];
        set("_applications_list", new_applications);
        setApplications(new_applications);
      }

      return response;
    } catch (error) {
      handle_api_error(error);
      throw error;
    }
  };

  const is_applied = (job_id: string): boolean => {
    return applications.some((application) => application.id === job_id);
  };

  useEffect(() => {
    fetchApplications();
    setLoading(false);
  }, [fetchApplications]);

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
