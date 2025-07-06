"use client";

import { EmployerApplication } from "@/lib/db/db.types";
import { ApplicationRow } from "./ApplicationRow";

interface ApplicationsTableProps {
  applications: EmployerApplication[];
  onApplicationClick: (application: EmployerApplication) => void;
  onNotesClick: (application: EmployerApplication) => void;
  onScheduleClick: (application: EmployerApplication) => void;
  onStatusChange: (application: EmployerApplication, status: number) => void;
}

export function ApplicationsTable({
  applications,
  onApplicationClick,
  onNotesClick,
  onScheduleClick,
  onStatusChange,
}: ApplicationsTableProps) {
  const sortedApplications = applications.toSorted(
    (a, b) =>
      new Date(b.applied_at ?? "").getTime() -
      new Date(a.applied_at ?? "").getTime()
  );

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1">
      {/* Table Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">
              Showing {applications.length} of {applications.length} applications
            </div>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <table className="relative w-full">
          <tbody className="absolute w-[100%]">
            {sortedApplications.map((application) => (
              <ApplicationRow
                key={application.id}
                application={application}
                onView={() => onApplicationClick(application)}
                onNotes={() => onNotesClick(application)}
                onSchedule={() => onScheduleClick(application)}
                onStatusChange={(status) => onStatusChange(application, status)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
