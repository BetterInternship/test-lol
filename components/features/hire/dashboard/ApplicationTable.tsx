import { EmployerApplication } from "@/lib/db/db.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pfp } from "@/components/shared/pfp";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { getFullName } from "@/lib/utils/user-utils";

interface ApplicationTableProps {
  applications: EmployerApplication[];
  app_statuses: any[];
  to_level_name: (level: any) => string;
  to_university_name: (university: any) => string;
  to_app_status_name: (status: any) => string;
  onRowClick: (application: EmployerApplication) => void;
  onNotesClick: (application: EmployerApplication) => void;
  onScheduleClick: (application: EmployerApplication) => void;
  onStatusChange: (application: EmployerApplication, status: string) => void;
}

export const ApplicationTable = ({
  applications,
  app_statuses,
  to_level_name,
  to_university_name,
  to_app_status_name,
  onRowClick,
  onNotesClick,
  onScheduleClick,
  onStatusChange,
}: ApplicationTableProps) => {
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
        <table className="w-full">
          <tbody className="divide-y divide-gray-50">
            {sortedApplications.map((application) => (
              <tr
                key={application.id}
                className="hover:bg-gray-100 hover:cursor-pointer transition-colors"
                onClick={() => onRowClick(application)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {application.user?.id && (
                      <Pfp user_id={application.user.id} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {getFullName(application.user)}{" "}
                        <span className="opacity-70">
                          — {to_university_name(application.user?.university)}{" "}
                          • {to_level_name(application.user?.year_level)}
                        </span>
                      </p>
                      <div className="text-sm text-gray-500">
                        <Badge strength="medium">
                          {application.job?.title}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 text-right">
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
                      options={app_statuses.map((as) => as.name)}
                      defaultValue={to_app_status_name(application.status) ?? ""}
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
};