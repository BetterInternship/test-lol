"use client";

// React imports
import React from "react";

// Next.js imports
import Link from "next/link";

// Third-party imports
import {
  BookA,
  Calendar,
  Clipboard,
  CheckCircle,
  Building,
} from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobTypeIcon, JobModeIcon, SalaryIcon } from "@/components/ui/icons";

// Hooks (preserving existing implementations)
import { useApplications } from "@/lib/api/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useRefs } from "@/lib/db/use-refs";
import { useMoa } from "@/lib/db/use-moa";

export default function ApplicationsPage() {
  const { redirect_if_not_logged_in: redirect_if_not_logged_in } =
    useAuthContext();
  const { check } = useMoa();
  const { applications, loading, error, refetch } = useApplications();
  const {
    universities,
    to_app_status_name,
    to_job_mode_name,
    to_job_type_name,
    to_job_allowance_name,
    to_job_pay_freq_name,
  } = useRefs();

  redirect_if_not_logged_in();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-gray-50">
      <div className="container max-w-5xl mx-auto">
        {/* Enhanced Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <BookA className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-h2 font-bold">My Applications</h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Track your internship applications and their status
              </p>
            </div>
          </div>
          {!loading && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="badge badge-info">
                {applications.length}{" "}
                {applications.length === 1 ? "application" : "applications"}
              </div>
              <div className="text-sm text-gray-500">
                Keep track of your submissions and updates
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center animate-scale-in">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading your applications...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="card max-w-md mx-auto p-8">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookA className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load applications
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
                Try Again
              </Button>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="card max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookA className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No applications yet
              </h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Ready to start your internship journey? Browse our job listings
                and submit your first application.
              </p>
              <Link href="/search">
                <Button className="bg-primary hover:bg-primary/90">
                  Browse Jobs
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 hover:shadow-lg transition-all duration-200 hover:border-gray-300 min-h-[200px] sm:min-h-[220px]"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                              {application.job?.title}
                            </h3>
                            <Badge type="accent">
                              {to_app_status_name(application.status)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-gray-700 mb-2 sm:mb-3">
                            <Building className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">
                              {application.job?.employer?.name ||
                                application.employer?.name ||
                                "Company Name"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm">
                              Applied on{" "}
                              {formatDate(application.applied_at ?? "")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                    {check(
                      application.job?.employer?.id ?? "",
                      universities[0]?.id
                    ) && (
                      <Badge type="supportive">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        DLSU MOA
                      </Badge>
                    )}
                    {(application.job?.type || application.job?.type === 0) && (
                      <Badge>
                        <JobTypeIcon type={application.job.type} />
                        {to_job_type_name(application.job.type)}
                      </Badge>
                    )}
                    {(application.job?.mode || application.job?.mode === 0) && (
                      <Badge>
                        <JobModeIcon mode={application.job.mode} />
                        {to_job_mode_name(application.job.mode)}
                      </Badge>
                    )}
                    {(application.job?.allowance ||
                      application.job?.allowance === 0) && (
                      <Badge>
                        <Clipboard className="w-3 h-3 mr-1" />
                        {to_job_allowance_name(application.job?.allowance)}
                      </Badge>
                    )}
                    {application.job?.salary && (
                      <Badge>
                        <SalaryIcon />
                        {application.job.salary}
                        {application.job.salary_freq &&
                          `/${to_job_pay_freq_name(
                            application.job.salary_freq
                          )}`}
                      </Badge>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                    {application.job?.description}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                    <Link
                      href={`/search/${application.job?.id}`}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        size="sm"
                        className="w-full sm:w-auto px-4 py-3 sm:py-2 font-medium hover:shadow-sm h-12 sm:h-auto"
                      >
                        View Job Details
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
