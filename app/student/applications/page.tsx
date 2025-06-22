"use client";

// React imports
import React from "react";

// Next.js imports
import Link from "next/link";

// Third-party imports
import {
  BookA,
  Calendar,
  Clock,
  Clipboard,
  CheckCircle,
  Building,
} from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobTypeIcon, JobModeIcon, SalaryIcon } from "@/components/ui/icons";

// Common components
import { StatusBadge } from "@/components/common";

// Hooks (preserving existing implementations)
import { useApplications } from "@/lib/api/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useRefs } from "@/lib/db/use-refs";
import { useMoa } from "@/lib/db/use-moa";

export default function ApplicationsPage() {
  const { redirect_if_not_loggedin } = useAuthContext();
  const { check } = useMoa();
  const { applications, loading, error, refetch } = useApplications();
  const {
    universities,
    to_job_mode_name,
    to_job_type_name,
    to_job_allowance_name,
  } = useRefs();

  redirect_if_not_loggedin();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
      <div className="container">
        {/* Enhanced Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <BookA className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-h2">My Applications</h1>
              <p className="text-gray-600">
                Track your internship applications and their status
              </p>
            </div>
          </div>
          {!loading && (
            <div className="flex items-center gap-3 mt-4">
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
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                            {application.job?.title}
                          </h3>
                          <StatusBadge
                            status={application.status ?? 0}
                            variant="with-icon"
                            size="md"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">
                            {application.job?.employer?.name ||
                              application.employer?.name ||
                              "Company Name"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">
                            Applied on{" "}
                            {formatDate(application.applied_at ?? "")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {check(
                    application.job?.employer?.id ?? "",
                    universities[0]?.id
                  ) && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1 bg-green-50 border-green-200 text-green-700"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      DLSU MOA
                    </Badge>
                  )}
                  {(application.job?.type || application.job?.type === 0) && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1"
                    >
                      <JobTypeIcon type={application.job.type} />
                      {to_job_type_name(application.job.type)}
                    </Badge>
                  )}
                  {(application.job?.mode || application.job?.mode === 0) && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1"
                    >
                      <JobModeIcon mode={application.job.mode} />
                      {to_job_mode_name(application.job.mode)}
                    </Badge>
                  )}
                  {(application.job?.allowance ||
                    application.job?.allowance === 0) && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1"
                    >
                      <Clipboard className="w-3 h-3 mr-1" />
                      {to_job_allowance_name(application.job?.allowance)}
                    </Badge>
                  )}
                  {application.job?.salary && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1"
                    >
                      <SalaryIcon />₱{application.job.salary}
                    </Badge>
                  )}
                  {application.job?.duration && (
                    <Badge
                      variant="outline"
                      className="text-xs flex items-center px-3 py-1"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {application.job.duration}
                    </Badge>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-2">
                  {application.job?.description}
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Application ID: {application.id?.slice(0, 8)}...
                  </div>
                  <Link href={`/search/${application.job?.id}`}>
                    <Button
                      size="sm"
                      className="px-4 py-2 font-medium hover:shadow-sm"
                    >
                      View Job Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
