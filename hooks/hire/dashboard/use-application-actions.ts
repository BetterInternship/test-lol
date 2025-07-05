// Business actions for applications - status updates, notes, etc.
// Pure operations that mutate state, no UI concerns
import { useEmployerApplications } from '@/hooks/use-employer-api';

export function useApplicationActions() {
  const { review } = useEmployerApplications();
  
  return {
    updateStatus: async (id: string, status: number) => {
      await review(id, { status });
    },
    updateNotes: async (id: string, notes: string) => {
      await review(id, { review: notes });
    }
  };
}