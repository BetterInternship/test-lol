"use client";

import { EmployerApplication } from "@/lib/db/db.types";
import { ApplicationRow } from "./ApplicationRow";
import { Card } from "@/components/ui/our-card";

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
    <Card className="max-h-full p-0 overflow-hidden">
      {/* Table Content */}
      <div className="flex-1 overflow-auto max-h-full">
        <table className="relative table-auto border-collapse w-full max-h-full">
          <thead>
            <tr>
              <th className="sticky text-left top-0 px-4 py-2 bg-gray-900 text-white z-50">
                Pending Applications
              </th>
            </tr>
          </thead>
          <tbody className="w-full max-h-full">
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
    </Card>
  );
}
