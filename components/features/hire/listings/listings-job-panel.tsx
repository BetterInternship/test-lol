import { EmployerJobCard } from "@/components/shared/jobs";
import { Paginator } from "@/components/ui/paginator";
import { Job } from "@/lib/db/db.types";

interface ListingsJobPanelProps {
  jobs: Job[];
  selectedJobId?: string;
  isEditing: boolean;
  jobsPage: number;
  jobsPageSize: number;
  onJobSelect: (job: Job) => void;
  onPageChange: (page: number) => void;
  updateJob: (job: Partial<Job>) => Promise<any>;
}

export function ListingsJobPanel({
  jobs,
  selectedJobId,
  isEditing,
  jobsPage,
  jobsPageSize,
  onJobSelect,
  onPageChange,
  updateJob,
}: ListingsJobPanelProps) {
  return (
    <div className="w-96 flex flex-col h-full max-w-[1024px] mx-auto">
      {/* Job Cards - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-4 border-r pt-4 pl-2">
        {jobs.map((job) => (
          <EmployerJobCard
            key={job.id}
            job={job}
            disabled={isEditing}
            // @ts-ignore
            update_job={updateJob}
            on_click={() => onJobSelect(job)}
            selected={job.id === selectedJobId}
          />
        ))}
      </div>
      
      {/* Paginator - following student portal pattern */}
      <div className="mt-4 flex-shrink-0">
        <Paginator
          totalItems={jobs.length}
          itemsPerPage={jobsPageSize}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
