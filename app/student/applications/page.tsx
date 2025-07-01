"use client";

// React imports
import React from "react";
import Link from "next/link";
import { BookA } from "lucide-react";

// UI components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Hooks (preserving existing implementations)
import { useApplications } from "@/lib/api/use-api";
import { useAuthContext } from "@/lib/ctx-auth";
import { useRefs } from "@/lib/db/use-refs";
import { formatTimeAgo } from "@/lib/utils";
import { Loader } from "@/components/ui/loader";
import { Card } from "@/components/ui/our-card";

export default function ApplicationsPage() {
  const { redirect_if_not_logged_in } = useAuthContext();
  const { applications, loading, error, refetch } = useApplications();
  const { ref_loading, to_app_status_name } = useRefs();

  redirect_if_not_logged_in();

  return (
    <div className="container max-w-5xl p-10 mx-auto">
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-2">
          <div className="w-10 h-10 mt-2 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
            <BookA className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-h2 font-bold">My Applications</h1>
            <p className="text-gray-600 text-sm sm:text-base mb-2">
              Track your internship applications and their status
            </p>
            <Badge>
              {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}
            </Badge>
          </div>
        </div>
      </div>
      <hr />
      <br />

      {ref_loading && loading ? (
        <Loader>Loading your applications...</Loader>
      ) : error ? (
        <div className="text-center py-16 animate-fade-in">
          <Card className="max-w-md m-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to load applications
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetch} className="bg-red-600 hover:bg-red-700">
              Try Again
            </Button>
          </Card>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <Card className="max-w-md m-auto">
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
          </Card>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {applications.map((application) => (
            <Card key={application.id}>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <div className="flex flex-row items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">
                        {application.job?.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700 mb-2 sm:mb-3">
                      <span className="text-sm">
                        {application.job?.employer?.name ||
                          application.employer?.name ||
                          "Company Name"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Badge type="accent">
                        Applied {formatTimeAgo(application.applied_at ?? "")}
                      </Badge>
                      <Badge type="accent">
                        {to_app_status_name(application.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                  <Link href={`/search/${application.job?.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
