import { useState, useMemo, useEffect } from "react";
import { useModal } from "@/hooks/use-modal";
import { useAuthContext } from "@/app/hire/authctx";
import { Job } from "@/lib/db/db.types";

export function useListingsBusinessLogic(ownedJobs: Job[] = []) {
  const { redirect_if_not_logged_in } = useAuthContext();
  
  const [selectedJob, setSelectedJob] = useState<Job>({} as Job);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  
  const jobsPageSize = 10;

  const {
    open: openCreateModal,
    close: closeCreateModal,
    Modal: CreateModal,
  } = useModal("create-modal");
  
  const {
    open: openDeleteModal,
    close: closeDeleteModal,
    Modal: DeleteModal,
  } = useModal("delete-modal");

  redirect_if_not_logged_in();

  const getJobLink = (job: Job) => {
    return `${process.env.NEXT_PUBLIC_CLIENT_URL}/search/${job.id}`;
  };

  // Filter jobs based on search term
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return ownedJobs;
    return ownedJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ownedJobs, searchTerm]);

  // Handle search input key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Could add additional search functionality here
    }
  };

  // Sync selected job with owned jobs updates
  useEffect(() => {
    const id = selectedJob.id;
    if (!id) return;
    setSelectedJob(ownedJobs.filter((j) => j.id === id)[0]);
  }, [ownedJobs, selectedJob.id]);

  // Reset saving state when editing stops
  useEffect(() => {
    if (!isEditing) setSaving(false);
  }, [isEditing]);

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setSaving(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleShare = () => {
    alert("Copied link to clipboard!");
    navigator.clipboard.writeText(getJobLink(selectedJob));
  };

  const clearSelectedJob = () => {
    setSelectedJob({} as Partial<Job>);
  };

  const handlePageChange = (page: number) => {
    setJobsPage(page);
  };

  return {
    // Local state
    selectedJob,
    searchTerm,
    saving,
    isEditing,
    jobsPage,
    jobsPageSize,
    filteredJobs,
    
    // Business logic actions
    setSearchTerm,
    setSaving,
    setIsEditing,
    setJobsPage,
    handleKeyPress,
    handleJobSelect,
    handleEditStart,
    handleSave,
    handleCancel,
    handleShare,
    clearSelectedJob,
    handlePageChange,
    getJobLink,
    
    // Modals
    openCreateModal,
    closeCreateModal,
    CreateModal,
    openDeleteModal,
    closeDeleteModal,
    DeleteModal,
  };
}
