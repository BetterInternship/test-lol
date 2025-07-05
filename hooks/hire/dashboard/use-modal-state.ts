// Modal state management - which modal is open, show/hide functions
// Centralizes all modal UI state instead of separate useModal calls
import { useState } from 'react';

export function useModalState() {
  const [activeModal, setActiveModal] = useState<'applicant' | 'resume' | 'review' | null>(null);
  
  return {
    showApplicant: () => setActiveModal('applicant'),
    showResume: () => setActiveModal('resume'),
    showReview: () => setActiveModal('review'),
    close: () => setActiveModal(null),
    activeModal
  };
}