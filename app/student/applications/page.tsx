"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookA, Calendar, Clock, Clipboard } from "lucide-react";
import { useApplications } from "@/hooks/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useRefs } from "@/lib/db/use-refs";
import { useAppContext } from "@/lib/ctx-app";
import { JobTypeIcon, JobModeIcon, SalaryIcon } from "@/components/ui/icons";

export default function ApplicationsPage() {
  const { redirect_if_not_loggedin } = useAuthContext();
  const { is_mobile } = useAppContext();
  const { applications, loading, error, refetch } = useApplications();
  const {
    to_job_mode_name,
    to_job_type_name,
    to_job_allowance_name,
    to_app_status_name,
  } = useRefs();

  redirect_if_not_loggedin();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get status badge color
  const getStatusBadgeVariant = (status: number) => {
    switch (status) {
      case 0:
        return "default";
      case 1:
        return "secondary";
      case 2:
        return "default";
      case 3:
        return "default";
      case 4:
        return "destructive";
      default:
        return "outline";
    }
  };

  // Helper function to get status display text
  const getStatusDisplayText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "⏳ Pending";
      case "reviewed":
        return "👀 Reviewed";
      case "shortlisted":
        return "⭐ Shortlisted";
      case "accepted":
        return "✅ Accepted";
      case "rejected":
        return "❌ Rejected";
      default:
        return status || "Unknown";
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <BookA className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          {!loading && (
            <Badge variant="outline" className="ml-2">
              {applications.length} applications
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Failed to load applications: {error}
            </p>
            <Button onClick={refetch}>Try Again</Button>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <BookA className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <div className="text-gray-500 text-lg mb-4 font-medium">
              No applications yet
            </div>
            <div className="text-gray-400 text-sm mb-6">
              Click on the apply button on any open job to start an application.
            </div>
            <Link href="/search">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div
                      className={`flex items-start justify-between ${
                        is_mobile ? "mb-3" : "mb-3"
                      }`}
                    >
                      <div className="flex-1">
                        <div
                          className={`flex ${
                            is_mobile ? "flex-col gap-3" : "items-center gap-3"
                          } mb-2`}
                        >
                          <h3
                            className={`${
                              is_mobile ? "text-xl" : "text-xl"
                            } font-semibold text-gray-900 leading-tight`}
                          >
                            {application.job?.title}
                          </h3>
                          <Badge
                            variant={getStatusBadgeVariant(
                              application.status ?? 0
                            )}
                            className={`text-xs w-fit ${
                              is_mobile ? "px-3 py-1" : ""
                            }`}
                          >
                            {to_app_status_name(application.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar
                            className={`${is_mobile ? "w-4 h-4" : "w-4 h-4"}`}
                          />
                          <span className={is_mobile ? "text-sm" : ""}>
                            Sent {formatDate(application.applied_at ?? "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex flex-wrap gap-2 ${
                      is_mobile ? "mb-4" : "mb-4"
                    }`}
                  >
                    {(application.job?.type || application.job?.type === 0) && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center ${
                          is_mobile ? "px-3 py-1" : ""
                        }`}
                      >
                        <JobTypeIcon type={application.job.type} />
                        {to_job_type_name(application.job.type)}
                      </Badge>
                    )}
                    {(application.job?.mode || application.job?.mode === 0) && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center ${
                          is_mobile ? "px-3 py-1" : ""
                        }`}
                      >
                        <JobModeIcon mode={application.job.mode} />
                        {to_job_mode_name(application.job.mode)}
                      </Badge>
                    )}
                    {(application.job?.allowance ||
                      application.job?.allowance === 0) && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center ${
                          is_mobile ? "px-3 py-1" : ""
                        }`}
                      >
                        <Clipboard className="w-3 h-3 mr-1" />
                        {to_job_allowance_name(application.job?.allowance)}
                      </Badge>
                    )}
                    {application.job?.salary && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center ${
                          is_mobile ? "px-3 py-1" : ""
                        }`}
                      >
                        <SalaryIcon />
                        {application.job.salary}
                      </Badge>
                    )}
                    {application.job?.duration && (
                      <Badge
                        variant="outline"
                        className={`text-xs flex items-center ${
                          is_mobile ? "px-3 py-1" : ""
                        }`}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {application.job.duration}
                      </Badge>
                    )}
                  </div>

                  <p
                    className={`text-gray-700 ${
                      is_mobile
                        ? "text-sm mb-5 leading-relaxed"
                        : "text-sm mb-4"
                    } line-clamp-2`}
                  >
                    {application.job?.description}
                  </p>

                  <div className="flex gap-3">
                    <Link href={`/search/${application.job?.id}`}>
                      <Button
                        size={is_mobile ? "default" : "sm"}
                        className={is_mobile ? "px-6 py-2 font-medium" : ""}
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
