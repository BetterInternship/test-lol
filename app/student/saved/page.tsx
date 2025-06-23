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

export default function SavedJobsPage() {
  const {
    is_authenticated,
    redirect_if_not_logged_in: redirect_if_not_logged_in,
  } = useAuthContext();
  const { save_job, saved_jobs, saving, loading, error, refetch } =
    useSavedJobs();
  const router = useRouter();
  const { is_mobile } = useAppContext();

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
        <div
          className={`flex-1 overflow-y-auto ${
            is_mobile ? "px-4 py-6 pb-24" : "p-8"
          }`}
        >
          <div className={`${is_mobile ? "max-w-none" : "max-w-6xl mx-auto"}`}>
            <div
              className={`flex items-center gap-3 ${
                is_mobile ? "mb-8" : "mb-8"
              }`}
            >
              <Heart
                className={`${
                  is_mobile ? "w-7 h-7" : "w-8 h-8"
                } text-red-500 fill-current`}
              />
              <h1
                className={`${
                  is_mobile ? "text-3xl" : "text-3xl"
                } font-bold text-gray-900`}
              >
                Saved Jobs
              </h1>
              {!loading && (
                <Badge
                  variant="outline"
                  className={`ml-2 ${is_mobile ? "text-sm px-3 py-1" : ""}`}
                >
                  {saved_jobs.length} saved
                </Badge>
              )}
            </div>

            {loading ? (
              <div className={`text-center ${is_mobile ? "py-16" : "py-12"}`}>
                <div
                  className={`animate-spin rounded-full ${
                    is_mobile ? "h-10 w-10" : "h-8 w-8"
                  } border-b-2 border-gray-900 mx-auto mb-4`}
                ></div>
                <p className={`text-gray-600 ${is_mobile ? "text-lg" : ""}`}>
                  Loading saved jobs...
                </p>
              </div>
            ) : error ? (
              <div className={`text-center ${is_mobile ? "py-16" : "py-12"}`}>
                <p
                  className={`text-red-600 mb-4 ${is_mobile ? "text-lg" : ""}`}
                >
                  Failed to load saved jobs: {error}
                </p>
                <Button onClick={refetch} size={is_mobile ? "lg" : "default"}>
                  Try Again
                </Button>
              </div>
            ) : saved_jobs.length === 0 ? (
              <div className={`text-center ${is_mobile ? "py-20" : "py-12"}`}>
                <Heart
                  className={`${
                    is_mobile ? "w-20 h-20" : "w-16 h-16"
                  } text-gray-300 mx-auto mb-6`}
                />
                <div
                  className={`text-gray-500 ${
                    is_mobile ? "text-xl mb-6" : "text-lg mb-4"
                  } font-medium`}
                >
                  No saved jobs yet
                </div>
                <div
                  className={`text-gray-400 ${
                    is_mobile
                      ? "text-base mb-8 px-4 leading-relaxed"
                      : "text-sm mb-6"
                  }`}
                >
                  Save jobs by clicking the heart icon on job listings to see
                  them here.
                </div>
                <Link href="/search">
                  <Button
                    size={is_mobile ? "lg" : "default"}
                    className={is_mobile ? "px-8 py-3 text-lg font-medium" : ""}
                  >
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            ) : (
              <div className={`space-y-${is_mobile ? "4" : "4"}`}>
                {saved_jobs.map((savedJob) => (
                  <div
                    key={savedJob.id}
                    className={`bg-white border border-gray-200 rounded-xl ${
                      is_mobile ? "p-5 shadow-sm" : "p-6"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div
                          className={`flex items-start justify-between ${
                            is_mobile ? "mb-3" : "mb-3"
                          }`}
                        >
                          <div className="flex-1">
                            <h3
                              className={`${
                                is_mobile ? "text-xl" : "text-xl"
                              } font-semibold text-gray-900 mb-2 leading-tight`}
                            >
                              {savedJob.title}
                            </h3>
                            <div
                              className={`flex items-center gap-2 text-gray-600 ${
                                is_mobile ? "mb-3" : "mb-2"
                              }`}
                            >
                              <Building
                                className={`${
                                  is_mobile ? "w-5 h-5" : "w-4 h-4"
                                }`}
                              />
                              <span
                                className={`font-medium ${
                                  is_mobile ? "text-base" : ""
                                }`}
                              >
                                {savedJob.employer?.name}
                              </span>
                            </div>
                            <div
                              className={`flex items-center gap-4 text-sm text-gray-500 ${
                                is_mobile ? "mb-4" : "mb-3"
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <MapPin
                                  className={`${
                                    is_mobile ? "w-4 h-4" : "w-4 h-4"
                                  }`}
                                />
                                <span className={is_mobile ? "text-sm" : ""}>
                                  {savedJob.employer?.location}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size={is_mobile ? "default" : "sm"}
                            disabled={saving}
                            onClick={() => handleUnsaveJob(savedJob.id ?? "")}
                            className={`text-red-600 border-red-200 hover:bg-red-50 ${
                              is_mobile ? "px-4 py-2 ml-3" : ""
                            }`}
                          >
                            <Trash2
                              className={`${
                                is_mobile ? "w-4 h-4 mr-2" : "w-4 h-4 mr-2"
                              }`}
                            />
                            {is_mobile ? "Remove" : "Remove"}
                          </Button>
                        </div>

                        <div
                          className={`flex flex-wrap gap-2 ${
                            is_mobile ? "mb-4" : "mb-4"
                          }`}
                        >
                          {savedJob.mode && (
                            <Badge
                              variant="outline"
                              className={is_mobile ? "px-3 py-1" : ""}
                            >
                              <Briefcase className="w-3 h-3 mr-1" />
                              {savedJob.mode}
                            </Badge>
                          )}
                          {savedJob.salary && (
                            <Badge
                              variant="outline"
                              className={is_mobile ? "px-3 py-1" : ""}
                            >
                              <PhilippinePeso className="w-3 h-3 mr-1" />
                              {savedJob.salary}
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
                          {savedJob.description}
                        </p>

                        <div
                          className={`flex gap-3 ${
                            is_mobile ? "flex-col sm:flex-row" : ""
                          }`}
                        >
                          <Link href={`/search/${savedJob.id}`}>
                            <Button
                              size={is_mobile ? "default" : "sm"}
                              className={`${
                                is_mobile
                                  ? "w-full sm:w-auto px-6 py-2 font-medium"
                                  : ""
                              }`}
                            >
                              View Details
                            </Button>
                          </Link>
                        </div>
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
