"use client";

import ContentLayout from "@/components/features/hire/content-layout";
import { ShowUnverifiedBanner } from "@/components/ui/banner";
import { useListingsBusinessLogic } from "@/hooks/hire/listings/use-listings-business-logic";
import { ListingsSearchBar } from "@/components/features/hire/listings/listings-search-bar";
import { ListingsJobPanel } from "@/components/features/hire/listings/listings-job-panel";
import { ListingsDetailsPanel } from "@/components/features/hire/listings/listings-details-panel";
import { ListingsCreateJobModal } from "@/components/features/hire/listings/listings-createjob-modal";
import { ListingsDeleteModal } from "@/components/features/hire/listings/listings-delete-modal";

export default function MyListings() {
  const {
    // Data
    profile,
    profileLoading,
    selectedJob,
    searchTerm,
    saving,
    isEditing,
    jobsPage,
    jobsPageSize,
    filteredJobs,
    
    // Actions
    create_job,
    update_job,
    delete_job,
    setSearchTerm,
    handleKeyPress,
    handleJobSelect,
    handleEditStart,
    handleSave,
    handleCancel,
    handleShare,
    clearSelectedJob,
    handlePageChange,
    
    // Modals
    openCreateModal,
    closeCreateModal,
    CreateModal,
    openDeleteModal,
    closeDeleteModal,
    DeleteModal,
  } = useListingsBusinessLogic();

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
                updateJob={update_job}
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
              updateJob={update_job}
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


