// Single row component for the applications table
// Props in (application data), events out (onView, onNotes, etc.)
// No business logic - just presentation and event emission
import { EmployerApplication } from "@/lib/db/db.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFullName } from "@/lib/utils/user-utils";
import { UserPfp } from "@/components/shared/pfp";
import { StatusDropdown } from "@/components/common/StatusDropdown";

interface ApplicationRowProps {
  application: EmployerApplication;
  statusOptions: any[];
  onView: () => void;
  onNotes: () => void;
  onSchedule: () => void;
  onStatusChange: (status: number) => void;
  toUniversityName: (university?: any) => string;
  toLevelName: (level?: any) => string;
  toAppStatusName: (status?: any) => string;
}

export function ApplicationRow({
  application,
  statusOptions,
  onView,
  onNotes,
  onSchedule,
  onStatusChange,
  toUniversityName,
  toLevelName,
  toAppStatusName,
}: ApplicationRowProps) {
  return (
    <tr
      className="w-full flex flex-row items-center justify-between border-b border-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-colors"
      onClick={onView}
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
              onNotes();
            }}
          >
            Notes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSchedule();
            }}
          >
            Schedule
          </Button>
          <StatusDropdown
            value={application.status ?? 0}
            options={statusOptions}
            disabled={toAppStatusName(application.status) === "Withdrawn"}
            onChange={onStatusChange}
          />
        </div>
      </td>
    </tr>
  );
}
