import { useState, useEffect, useCallback } from "react";
import {
  job_service,
  user_service,
  application_service,
  auth_service,
  handle_api_error,
} from "@/lib/api";
import { Job, User, Application } from "@/lib/api-client";
import { useAuthContext } from "@/app/student/authctx";

// Jobs Hook
export function useJobs(
  params: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    mode?: string;
    search?: string;
    location?: string;
  } = {}
) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    total: 0,
  });

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await job_service.get_jobs(params);
      setJobs(response.jobs);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        total: response.total,
      });
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    pagination,
    refetch: fetchJobs,
  };
}

// Single Job Hook
export function useJob(jobId: string | null) {
  const { is_authenticated } = useAuthContext();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobData = await job_service.get_job_by_id(jobId);
        setJob(jobData);

        // Track view if user is authenticated
        if (is_authenticated()) {
          job_service.track_view(jobId).catch(console.error);
        }
      } catch (err) {
        const errorMessage = handle_api_error(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

  return { job, loading, error };
}

// User Profile Hook
export function useProfile() {
  const { is_authenticated } = useAuthContext();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await user_service.get_profile();
      setProfile(userData as User);
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

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedProfile = await user_service.update_profile(data);
      setProfile(updatedProfile as User);
      return updatedProfile;
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

// Saved Jobs Hook
export function useSavedJobs(page = 1, limit = 10) {
  const { is_authenticated } = useAuthContext();
  const [savedJobs, setSavedJobs] = useState<
    Array<{
      savedId: string;
      savedAt: string;
      job: Job;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    total: 0,
  });

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await user_service.get_saved_jobs(page, limit);
      console.log(response);
      setSavedJobs(response.savedJobs);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        total: response.total,
      });
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (is_authenticated()) {
      fetchSavedJobs();
    } else {
      setLoading(false);
    }
  }, [fetchSavedJobs]);

  return {
    savedJobs,
    loading,
    error,
    pagination,
    refetch: fetchSavedJobs,
  };
}

// Applications Hook
export function useApplications(
  params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}
) {
  const { is_authenticated } = useAuthContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    currentPage: 1,
    total: 0,
  });

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await application_service.get_applications(params);
      setApplications(response.applications);
      setPagination({
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        total: response.total,
      });
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => {
    if (is_authenticated()) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    pagination,
    refetch: fetchApplications,
  };
}

// Job Save/Unsave Hook
export function useJobActions() {
  const { is_authenticated } = useAuthContext();
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [appliedJobs, setAppliedJobs] = useState<Map<string, any>>(new Map());

  const checkSaved = async (jobId: string) => {
    try {
      if (!is_authenticated()) return false;

      const response = await user_service.check_saved(jobId);
      if (response.state) {
        setSavedJobs((prev) => new Set(prev).add(jobId));
      }
      return response.state;
    } catch (error) {
      console.error("Error checking saved status:", error);
      return false;
    }
  };

  const checkApplied = async (jobId: string) => {
    try {
      if (!is_authenticated()) return null;

      const response = await application_service.check_application(jobId);
      if (response.hasApplied) {
        setAppliedJobs((prev) =>
          new Map(prev).set(jobId, {
            applicationId: response.applicationId,
            status: response.status,
            appliedAt: response.appliedAt,
          })
        );
      }
      return response;
    } catch (error) {
      console.error("Error checking application status:", error);
      return null;
    }
  };

  const saveJob = async (jobId: string) => {
    try {
      const response = await user_service.save_job(jobId);
      if (response.state) {
        setSavedJobs((prev) => new Set(prev).add(jobId));
      } else {
        setSavedJobs((prev) => {
          const newSet = new Set(prev);
          newSet.delete(jobId);
          return newSet;
        });
      }
      return response;
    } catch (error) {
      handle_api_error(error);
      throw error;
    }
  };

  const applyToJob = async (
    jobId: string,
    data: {
      coverLetter?: string;
      githubLink?: string;
      portfolioLink?: string;
      resumeFilename?: string;
    }
  ) => {
    try {
      const response = await application_service.create_application({
        jobId,
        ...data,
      });

      setAppliedJobs((prev) =>
        new Map(prev).set(jobId, {
          applicationId: response.application.id,
          status: response.application.status,
          appliedAt: response.application.appliedAt,
        })
      );

      return response;
    } catch (error) {
      handle_api_error(error);
      throw error;
    }
  };

  const isSaved = (jobId: string) => savedJobs.has(jobId);
  const getApplicationStatus = (jobId: string) => appliedJobs.get(jobId);

  return {
    checkSaved,
    checkApplied,
    saveJob,
    applyToJob,
    isSaved,
    getApplicationStatus,
  };
}

// Dashboard Stats Hook
export function useDashboardStats() {
  const [stats, setStats] = useState<{
    applications: {
      total_applications: number;
      pending: number;
      reviewed: number;
      shortlisted: number;
      accepted: number;
      rejected: number;
    };
    saved_jobs_count: number;
    recent_activity: Array<{
      activity_type: string;
      created_at: string;
      metadata?: any;
    }>;
    profile_completeness: number;
  } | null>(null);
  const { is_authenticated } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await user_service.get_dashboard_stats();
      setStats(data);
    } catch (err) {
      const errorMessage = handle_api_error(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (is_authenticated()) {
      fetchStats();
    } else {
      setLoading(false);
    }
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
