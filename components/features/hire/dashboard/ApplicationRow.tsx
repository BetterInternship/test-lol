// Single row component for the applications table
// Props in (application data), events out (onView, onNotes, etc.)
// No business logic - just presentation and event emission
import { EmployerApplication } from "@/lib/db/db.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFullName } from "@/lib/utils/user-utils";
import { UserPfp } from "@/components/shared/pfp";
import { StatusDropdown } from "@/components/common/StatusDropdown";
import { useAppContext } from "@/lib/ctx-app";
import { cn } from "@/lib/utils";

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
  const { isMobile } = useAppContext();

  return (
    <tr
      className={cn(
        "w-full border-b border-gray-50 hover:bg-gray-100 hover:cursor-pointer transition-colors",
        isMobile 
          ? "flex flex-col space-y-3 p-4" 
          : "flex flex-row items-center justify-between"
      )}
      onClick={onView}
    >
      <td className={cn(
        isMobile ? "w-full" : "px-4 py-2"
      )}>
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
      <td className={cn(
        "text-center",
        isMobile ? "w-full px-0" : "px-6"
      )}>
        <div className={cn(
          "flex items-center space-x-2",
          isMobile 
            ? "flex-col space-y-2 space-x-0" 
            : "flex-row justify-end"
        )}>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onNotes();
            }}
            className={isMobile ? "w-full" : ""}
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
            className={isMobile ? "w-full" : ""}
          >
            Schedule
          </Button>
          <div className={isMobile ? "w-full" : ""}>
            <StatusDropdown
              value={application.status ?? 0}
              options={statusOptions}
              disabled={toAppStatusName(application.status) === "Withdrawn"}
              onChange={onStatusChange}
              className={isMobile ? "w-full" : "w-36"}
            />
          </div>
        </div>
      </td>
    </tr>
  );
}
