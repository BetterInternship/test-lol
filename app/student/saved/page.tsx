"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Calendar,
  MapPin,
  Building,
  Trash2,
  Briefcase,
  PhilippinePeso,
} from "lucide-react";
import { useSavedJobs } from "@/lib/api/use-api";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../lib/ctx-auth";
import { useAppContext } from "@/lib/ctx-app";
import { useRefs } from "@/lib/db/use-refs";

export default function SavedJobsPage() {
  const {
    is_authenticated,
    redirect_if_not_logged_in: redirect_if_not_logged_in,
  } = useAuthContext();
  const { save_job, saved_jobs, saving, loading, error, refetch } =
    useSavedJobs();
  const router = useRouter();
  const { is_mobile } = useAppContext();
  const { to_job_pay_freq_name } = useRefs();

  redirect_if_not_logged_in();

  const handleUnsaveJob = async (job_id: string) => {
    try {
      await save_job(job_id); // This will toggle the saved status
      refetch(); // Refresh the saved jobs list
    } catch (error) {
      console.error("Failed to unsave job:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!is_authenticated()) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Saved Jobs Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-6 sm:pb-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 fill-current" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Saved Jobs
              </h1>
              {!loading && (
                <Badge
                  variant="outline"
                  className="ml-2 text-sm px-3 py-1"
                >
                  {saved_jobs.length} saved
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 sm:py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p className="text-gray-600 text-base sm:text-lg">
                  Loading saved jobs...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12 sm:py-16">
                <p className="text-red-600 mb-4 text-base sm:text-lg">
                  Failed to load saved jobs: {error}
                </p>
                <Button onClick={refetch} size="default" className="h-11 px-6">
                  Try Again
                </Button>
              </div>
            ) : saved_jobs.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <Heart className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-6" />
                <div className="text-gray-500 text-lg sm:text-xl mb-4 sm:mb-6 font-medium">
                  No saved jobs yet
                </div>
                <div className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 px-4 sm:px-0 leading-relaxed max-w-md mx-auto">
                  Save jobs by clicking the heart icon on job listings to see
                  them here.
                </div>
                <Link href="/search">
                  <Button
                    size="default"
                    className="h-11 px-8 text-base font-medium"
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {saved_jobs.map((savedJob) => (
                  <div
                    key={savedJob.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow min-h-[180px] sm:min-h-[200px]"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 leading-tight">
                            {savedJob.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2 sm:mb-3">
                            <Building className="w-4 h-4 flex-shrink-0" />
                            <span className="font-medium text-sm sm:text-base">
                              {savedJob.employer?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 sm:mb-4">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>{savedJob.employer?.location}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={saving}
                          onClick={() => handleUnsaveJob(savedJob.id ?? "")}
                          className="text-red-600 border-red-200 hover:bg-red-50 flex-shrink-0 h-9 px-3"
                        >
                          <Trash2 className="w-4 h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Remove</span>
                          <span className="sm:hidden">Remove</span>
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                        {savedJob.mode && (
                          <Badge
                            variant="outline"
                            className="px-2 sm:px-3 py-1 text-xs"
                          >
                            <Briefcase className="w-3 h-3 mr-1" />
                            {savedJob.mode}
                          </Badge>
                        )}
                        {savedJob.salary && (
                          <Badge
                            variant="outline"
                            className="px-2 sm:px-3 py-1 text-xs"
                          >
                            <PhilippinePeso className="w-3 h-3 mr-1" />
                            {savedJob.salary}/{to_job_pay_freq_name(savedJob.salary_freq)}
                          </Badge>
                        )}
                      </div>

                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2 mb-4">
                        {savedJob.description}
                      </p>

                      <div className="flex gap-3">
                        <Link href={`/search/${savedJob.id}`} className="flex-1 sm:flex-none">
                          <Button
                            size="sm"
                            className="w-full sm:w-auto h-10 px-6 font-medium"
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
      </div>
    </div>
  );
}
