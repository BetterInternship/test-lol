import { useState, useEffect, useCallback, useMemo } from "react";
import {
  job_service,
  handle_api_error,
  application_service,
} from "@/lib/api/api";
import {
  Employer,
  EmployerApplication,
  Job,
  PrivateUser,
} from "@/lib/db/db.types";
import { useCache } from "./use-cache";
import { employer_auth_service } from "@/lib/api/employer.api";

export function useUsers() {
  const [users, set_users] = useState<PrivateUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employer_auth_service.get_all_users();
      if (response.success)
        // @ts-ignore
        set_users(response.users ?? []);
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
  };
}

export function useEmployers() {
  const [employers, set_employers] = useState<Employer[]>([]);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  const fetchEmployers = async () => {
    try {
      set_loading(true);
      set_error(null);
      const response = await employer_auth_service.get_all_employers();
      if (response.success)
        // @ts-ignore
        set_employers(response.employers ?? []);
    } catch (err) {
      const errorMessage = handle_api_error(err);
      set_error(errorMessage);
    } finally {
      set_loading(false);
    }
  };

  const verify = async (employer_id: string, new_status: boolean) => {
    set_loading(true);

    const old_employer = employers.filter((e) => e.id === employer_id)[0];
    const response = new_status
      ? await employer_auth_service.verify_employer(employer_id)
      : await employer_auth_service.unverify_employer(employer_id);

    // Error
    if (!response.success) {
      set_error(response.message ?? "");
      return;
    }

    // Update cache
    set_employers([
      ...employers.filter((e) => e.id !== employer_id),
      { ...old_employer, is_verified: new_status },
    ]);

    set_loading(false);
  };

  useEffect(() => {
    fetchEmployers();
  }, []);

  return {
    employers,
    verify,
    loading,
    error,
  };
}

export function useEmployerApplications() {
  const { get_cache, set_cache } = useCache<EmployerApplication[]>(
    "_apps_employer_list"
  );
  const [employerApplications, setEmployerApplications] = useState<
    EmployerApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployerApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached_employer_applications = null;

      if (cached_employer_applications) {
        setEmployerApplications(cached_employer_applications);
        return;
      }

      // Otherwise, pull from server
      const response = await application_service.get_employer_applications();
      if (response.success) {
        setEmployerApplications(response.applications ?? []);
        set_cache(response.applications ?? []);
      }
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const review = async (
    app_id: string,
    review_options: { review?: string; notes?: string; status?: number }
  ) => {
    const cache = get_cache() as EmployerApplication[];
    const response = await application_service.review_application(
      app_id,
      review_options
    );

    if (cache) {
      const new_apps = [
        {
          ...cache.filter((a) => a?.id === app_id)[0],
          // @ts-ignore
          ...response.application,
        },
        ...cache.filter((a) => a?.id !== app_id),
        // @ts-ignore
      ].sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      set_cache(new_apps);
      setEmployerApplications(get_cache() as EmployerApplication[]);
    } else {
      // @ts-ignore
      set_cache([response.application]);
      // @ts-ignore
      setEmployerApplications([response.application]);
    }
    return response;
  };

  useEffect(() => {
    fetchEmployerApplications();
    setLoading(false);
  }, [fetchEmployerApplications]);

  return {
    employer_applications: employerApplications,
    review,
    loading,
    error,
    refetch: fetchEmployerApplications,
  };
}

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
  const { get_cache, set_cache } = useCache<Job[]>("_jobs_owned_list");
  const [ownedJobs, setOwnedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOwnedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached_saved_jobs = null;

      // Otherwise, pull from server
      const response = await job_service.get_owned_jobs();
      if (response.success) {
        setOwnedJobs(response.jobs ?? []);
        set_cache(response.jobs ?? []);
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
      // @ts-ignore
      const job = response.job;
      const old_job = ownedJobs.filter((oj) => oj.id === job.id)[0] ?? {};
      set_cache([
        { ...old_job, ...job },
        ...ownedJobs.filter((oj) => oj.id !== job.id),
      ]);
      setOwnedJobs(get_cache() ?? []);
    }
    return response;
  };

  const create_job = async (job: Partial<Job>) => {
    const response = await job_service.create_job(job);
    if (response.success) {
      // @ts-ignore
      const job = response.job;
      set_cache([job, ...ownedJobs]);
      setOwnedJobs(get_cache() ?? []);
    }
    return response;
  };

  const delete_job = async (job_id: string) => {
    const response = await job_service.delete_job(job_id);
    if (response.success) {
      set_cache(ownedJobs.filter((job) => job.id !== job_id));
      setOwnedJobs(get_cache() ?? []);
    }
  };

  useEffect(() => {
    fetchOwnedJobs();
    setLoading(false);
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
  }, [ownedJobs, params]);

  return {
    ownedJobs: filteredJobs,
    update_job,
    create_job,
    delete_job,
    loading,
    error,
    refetch: fetchOwnedJobs,
  };
}
