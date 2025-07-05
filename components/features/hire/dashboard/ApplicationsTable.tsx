"use client";

import { EmployerApplication } from "@/lib/db/db.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { getFullName } from "@/lib/utils/user-utils";
import { UserPfp } from "@/components/shared/pfp";

//for future reference, this is the actual table of applicants/applications. not anywhere else.

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
      {/* Table Header with Filters */}
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
              <tr
                key={application.id}
                className="w-full flex flex-row items-center justify-between border-b border-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-colors"
                onClick={() => onApplicationClick(application)}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    {application.user?.id && (
                      <UserPfp user_id={application.user.id} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {getFullName(application.user)}{" "}
                        <span className="opacity-70">
                          — {toUniversityName(application.user?.university)} •{" "}
                          {toLevelName(application.user?.year_level)}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        <Badge strength="medium">{application.job?.title}</Badge>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 text-center">
                  <div className="flex flex-row items-center justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotesClick(application);
                      }}
                    >
                      Notes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleClick(application);
                      }}
                    >
                      Schedule
                    </Button>
                    <GroupableRadioDropdown
                      name="status"
                      className="w-36"
                      disabled={toAppStatusName(application.status) === "Withdrawn"}
                      options={appStatuses}
                      defaultValue={application.status}
                      onChange={(status) => onStatusChange(application, status)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
