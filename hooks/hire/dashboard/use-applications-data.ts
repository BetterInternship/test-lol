// Data fetching hook for dashboard - just gets applications and profile data
// No business logic, no UI state, just pure data
import { useEmployerApplications, useProfile } from '@/hooks/use-employer-api';

export function useApplicationsData() {
  const { employer_applications, loading } = useEmployerApplications();
  const { profile, loading: profileLoading } = useProfile();
  return { applications: employer_applications, loading, profile, profileLoading };
}