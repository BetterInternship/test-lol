"use client";

import ContentLayout from "@/components/features/hire/content-layout";
import { ShowUnverifiedBanner } from "@/components/ui/banner";
import { useListingsBusinessLogic } from "@/hooks/hire/listings/use-listings-business-logic";
import { useOwnedJobs, useProfile } from "@/hooks/use-employer-api";
import { Job } from "@/lib/db/db.types";
import { ListingsSearchBar } from "@/components/features/hire/listings/listings-search-bar";
import { ListingsJobPanel } from "@/components/features/hire/listings/listings-job-panel";
import { ListingsDetailsPanel } from "@/components/features/hire/listings/listings-details-panel";
import { ListingsCreateJobModal } from "@/components/features/hire/listings/listings-createjob-modal";
import { ListingsDeleteModal } from "@/components/features/hire/listings/listings-delete-modal";

export default function MyListings() {
  // Get data from employer API hooks
  const { profile, loading: profileLoading } = useProfile();
  const { ownedJobs, create_job, update_job, delete_job } = useOwnedJobs();

  // Get business logic from listings hook
  const {
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
  } = useListingsBusinessLogic(ownedJobs);

  // Wrapper function to adapt the API signature
  const handleUpdateJob = async (job: Partial<Job>) => {
    if (!job.id) throw new Error("Job ID is required for update");
    return await update_job(job.id, job);
  };

  return (
    <ContentLayout>
      <>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Unverified Banner */}
          {!profileLoading && !profile?.is_verified && (
            <div className="p-6 pb-0">
              <ShowUnverifiedBanner />
            </div>
          )}
          
          {/* Content Area */}
          <div className="flex-1 p-6 flex gap-6 overflow-hidden">
            {/* Left Panel - Job List */}
            <div className="w-96 flex flex-col h-full">
              <ListingsSearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onKeyPress={handleKeyPress}
                onCreateJob={openCreateModal}
              />
              
              <ListingsJobPanel
                jobs={filteredJobs}
                selectedJobId={selectedJob?.id}
                isEditing={isEditing}
                jobsPage={jobsPage}
                jobsPageSize={jobsPageSize}
                onJobSelect={handleJobSelect}
                onPageChange={handlePageChange}
                updateJob={handleUpdateJob}
              />
            </div>

            {/* Right Panel - Job Details */}
            <ListingsDetailsPanel
              selectedJob={selectedJob}
              isEditing={isEditing}
              saving={saving}
              onEdit={handleEditStart}
              onSave={handleSave}
              onCancel={handleCancel}
              onShare={handleShare}
              onDelete={openDeleteModal}
              updateJob={handleUpdateJob}
            />
          </div>
        </div>

        {/* Create Job Modal */}
        <CreateModal>
          <ListingsCreateJobModal
            createJob={create_job}
            close={closeCreateModal}
          />
        </CreateModal>

        {/* Delete Job Modal */}
        <DeleteModal>
          <ListingsDeleteModal
            job={selectedJob}
            deleteJob={delete_job}
            clearJob={clearSelectedJob}
            close={closeDeleteModal}
          />
        </DeleteModal>
      </>
    </ContentLayout>
  );
}


