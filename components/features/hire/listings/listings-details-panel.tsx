import { Button } from "@/components/ui/button";
import { Job } from "@/lib/db/db.types";

// Placeholder component for EditableJobDetails
const EditableJobDetails = ({ is_editing, job, saving, update_job, actions }: any) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{job?.title || 'Job Details'}</h2>
      <p className="mb-4">{job?.description || 'No description available'}</p>
      <div className="flex gap-2">
        {actions}
      </div>
    </div>
  );
};

interface ListingsDetailsPanelProps {
  selectedJob: Job | null;
  isEditing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onShare: () => void;
  onDelete: () => void;
  updateJob: (job: Partial<Job>) => Promise<any>;
}

export function ListingsDetailsPanel({
  selectedJob,
  isEditing,
  saving,
  onEdit,
  onSave,
  onCancel,
  onShare,
  onDelete,
  updateJob,
}: ListingsDetailsPanelProps) {
  if (!selectedJob?.id) {
    return (
      <div className="h-full m-auto max-w-[1024px] mx-auto">
        <div className="flex flex-col items-center pt-[25vh] h-screen">
          <div className="opacity-35 mb-10">
            <div className="flex flex-row justify-center w-full mb-4">
              <h1 className="block text-6xl font-heading font-bold ">
                BetterInternship
              </h1>
            </div>
            <div className="flex flex-row justify-center w-full">
              <p className="block text-2xl">
                Better Internships Start Here
              </p>
            </div>
          </div>
          <div className="w-prose text-center border border-blue-500 border-opacity-50 text-blue-500 shadow-sm rounded-md p-4 bg-white">
            Click on a job listing to view more details!
          </div>
        </div>
      </div>
    );
  }

  const getActionButtons = () => {
    if (isEditing) {
      return [
        <Button
          key="save"
          variant="default"
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Saving..." : "Save"}
        </Button>,
        <Button
          key="cancel"
          variant="outline"
          scheme="destructive"
          disabled={saving}
          onClick={onCancel}
        >
          Cancel
        </Button>,
      ];
    }

    return [
      <Button
        key="edit"
        variant="outline"
        disabled={saving}
        onClick={onEdit}
      >
        Edit
      </Button>,
      <Button
        key="share"
        variant="outline"
        disabled={saving}
        onClick={onShare}
      >
        Share
      </Button>,
      <Button
        key="delete"
        variant="outline"
        disabled={saving}
        className="text-red-500 border border-red-300 hover:bg-red-50 hover:text-red-500"
        onClick={onDelete}
      >
        Delete
      </Button>,
    ];
  };

  return (
    <div className="max-w-[1024px] mx-auto">
      <EditableJobDetails
        is_editing={isEditing}
        set_is_editing={() => {}} // This will be handled by the parent component
        job={selectedJob}
        saving={saving}
        // @ts-ignore
        update_job={updateJob}
        actions={getActionButtons()}
      />
    </div>
  );
}
