"use client";

import { EmployerApplication } from "@/lib/db/db.types";
import { ApplicationRow } from "./ApplicationRow";

interface ApplicationsTableProps {
  applications: EmployerApplication[];
  appStatuses: any[];
  onApplicationClick: (application: EmployerApplication) => void;
  onNotesClick: (application: EmployerApplication) => void;
  onScheduleClick: (application: EmployerApplication) => void;
  onStatusChange: (application: EmployerApplication, status: number) => void;
  toUniversityName: (university?: any) => string;
  toLevelName: (level?: any) => string;
  toAppStatusName: (status?: any) => string;
}

export function ApplicationsTable({
  applications,
  appStatuses,
  onApplicationClick,
  onNotesClick,
  onScheduleClick,
  onStatusChange,
  toUniversityName,
  toLevelName,
  toAppStatusName,
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
                statusOptions={appStatuses}
                onView={() => onApplicationClick(application)}
                onNotes={() => onNotesClick(application)}
                onSchedule={() => onScheduleClick(application)}
                onStatusChange={(status) => onStatusChange(application, status)}
                toUniversityName={toUniversityName}
                toLevelName={toLevelName}
                toAppStatusName={toAppStatusName}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
