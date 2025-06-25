/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-19 04:14:35
 * @ Modified time: 2025-06-23 22:10:52
 * @ Description:
 *
 * What employers see when clicking on an applicant to view.
 * Can also be previewed by applicants, that's why it's a shared component.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Job, PublicUser } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { useModal } from "@/hooks/use-modal";
import { useFile } from "@/hooks/use-file";
import { useClientDimensions } from "@/hooks/use-dimensions";
import { user_service } from "@/lib/api/api";
import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Award,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";
import { get_full_name } from "@/lib/utils/user-utils";

export const ApplicantModalContent = ({
  applicant = {} as Partial<PublicUser>,
  clickable = true,
  open_resume_modal,
  open_calendar_modal,
  job = {} as Partial<Job>,
}: {
  applicant?: Partial<PublicUser>;
  clickable?: boolean;
  open_resume_modal?: () => void;
  open_calendar_modal?: () => void;
  job?: Partial<Job>;
}) => {
  const { to_level_name, to_college_name, to_job_type_name } = useRefs();
  const { client_width, client_height } = useClientDimensions();

  // Resume modal setup
  const {
    open: open_internal_resume_modal,
    close: close_resume_modal,
    Modal: ResumeModal,
  } = useModal("resume-modal");

  // Calendar modal setup
  const {
    open: open_internal_calendar_modal,
    close: close_calendar_modal,
    Modal: CalendarModal,
  } = useModal("calendar-modal");

  // Resume URL management
  const [resume_route, set_resume_route] = useState("");

  const get_user_resume_url = useCallback(
    async () => user_service.get_user_resume_url(applicant?.id ?? ""),
    [applicant?.id]
  );

  const { url: resume_url, sync: sync_resume_url } = useFile({
    fetcher: get_user_resume_url,
    route: resume_route,
  });

  // Profile picture URL management
  const [pfp_route, set_pfp_route] = useState("");

  const get_user_pfp_url = useCallback(
    async () => user_service.get_user_pfp_url(applicant?.id ?? ""),
    [applicant?.id]
  );

  const { url: pfp_url, sync: sync_pfp_url } = useFile({
    fetcher: get_user_pfp_url,
    route: pfp_route,
  });

  // Set the resume and profile picture routes when applicant changes
  useEffect(() => {
    if (applicant?.id) {
      set_resume_route(`/users/${applicant.id}/resume`);
      set_pfp_route(`/users/${applicant.id}/pic`);
    }
  }, [applicant?.id]);

  // Sync profile picture when modal opens
  useEffect(() => {
    if (applicant?.id && applicant?.profile_picture) {
      sync_pfp_url();
    }
  }, [applicant?.id, applicant?.profile_picture, sync_pfp_url]);

  // Handle resume button click
  const handleResumeClick = async () => {
    if (!clickable || !applicant?.resume || !applicant?.id) return;

    if (open_resume_modal) {
      // Use external modal handler if provided
      open_resume_modal();
    } else {
      // Use internal modal - ensure route is set first
      if (!resume_route) {
        set_resume_route(`/users/${applicant.id}/resume`);
      }

      try {
        await sync_resume_url();
        open_internal_resume_modal();
      } catch (error) {
        console.error("Failed to sync resume URL:", error);
        // Optionally show user-friendly error message
      }
    }
  };

  // Handle calendar button click
  const handleCalendarClick = () => {
    if (!clickable || !applicant?.calendar_link) return;

    if (open_calendar_modal) {
      // Use external modal handler if provided
      open_calendar_modal();
    } else {
      // Use internal modal
      window.open(applicant.calendar_link, '_blank').focus();
      // open_internal_calendar_modal();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0 max-h-[80vh]">
        {/* Fixed Header Section - Not Scrollable */}
        <div className="flex-shrink-0 px-8 md:px-10 pt-6 pb-6 border-b border-gray-100">
          {/* Header with Profile Picture and Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <Avatar className="h-20 w-20 md:h-24 md:w-24">
                {applicant?.profile_picture && pfp_url ? (
                  <AvatarImage src={pfp_url} alt="Profile picture" />
                ) : (
                  <AvatarFallback className="text-xl font-semibold bg-blue-100 text-blue-700">
                    {applicant?.first_name?.[0]?.toUpperCase() || ""}
                    {applicant?.last_name?.[0]?.toUpperCase() || ""}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>

            {/* Name and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 font-medium">Active</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {get_full_name(applicant) === ""
                  ? "No Name"
                  : get_full_name(applicant)}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-4">
                Applying for {job?.title ?? "Sample Position"}{" "}
                {job?.type !== undefined && job?.type !== null
                  ? `• ${to_job_type_name(job.type)}`
                  : ""}
              </p>

              {/* Indicate if taking for credit */}
              {applicant.taking_for_credit && (
                <div>
                  <span className="inline-flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    Taking for credit
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 text-base px-6 font-medium flex-1 sm:flex-none"
              disabled={!clickable || !applicant.resume}
              onClick={handleResumeClick}
            >
              <FileText className="h-4 w-4 mr-2" />
              {applicant.resume ? "View Resume" : "No Resume"}
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 h-11 text-base px-6 font-medium flex-1 sm:flex-none"
              disabled={!clickable || !applicant?.calendar_link}
              onClick={handleCalendarClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {applicant?.calendar_link ? "Schedule" : "No Calendar"}
            </Button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 md:px-10 py-6">
          {/* Academic Background Card */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Academic Background
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Program</p>
                <p className="font-medium text-gray-900 text-base">
                  {to_college_name(applicant?.college)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Institution</p>
                <p className="font-medium text-gray-900 text-base">DLSU Manila</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Year Level</p>
                <p className="font-medium text-gray-900 text-base">
                  {to_level_name(applicant?.year_level)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Email</p>
                <p className="font-medium text-gray-900 text-base break-all">
                  {applicant?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Contact & Professional Links
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Phone Number</p>
                <p className="font-medium text-gray-900 text-base">
                  {applicant?.phone_number || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Portfolio</p>
                {applicant?.portfolio_link ? (
                  <a
                    href={applicant?.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={
                      !clickable
                        ? { pointerEvents: "none", cursor: "default" }
                        : {}
                    }
                    className="text-blue-600 hover:underline font-medium break-all text-base"
                  >
                    View Portfolio
                  </a>
                ) : (
                  <p className="font-medium text-gray-900 text-base">
                    Not provided
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">GitHub</p>
                {applicant?.github_link ? (
                  <a
                    href={applicant?.github_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={
                      !clickable
                        ? { pointerEvents: "none", cursor: "default" }
                        : {}
                    }
                    className="text-blue-600 hover:underline font-medium break-all text-base"
                  >
                    View GitHub
                  </a>
                ) : (
                  <p className="font-medium text-gray-900 text-base">
                    Not provided
                  </p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">LinkedIn</p>
                {applicant?.linkedin_link ? (
                  <a
                    href={applicant?.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={
                      !clickable
                        ? { pointerEvents: "none", cursor: "default" }
                        : {}
                    }
                    className="text-blue-600 hover:underline font-medium break-all text-base"
                  >
                    View LinkedIn
                  </a>
                ) : (
                  <p className="font-medium text-gray-900 text-base">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About the Candidate - Only show if bio exists */}
          {applicant?.bio && applicant.bio.trim() && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                About the Candidate
              </h3>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  {applicant.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Modal */}
      {resume_url.length > 0 && (
        <ResumeModal>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold px-6 pt-2">Resume Preview</h1>
            <div className="px-6 pb-6">
              <iframe
                allowTransparency={true}
                className="w-full border border-gray-200 rounded-lg"
                style={{
                  width: "100%",
                  height: client_height * 0.75,
                  minHeight: "600px",
                  maxHeight: "800px",
                  background: "#FFFFFF",
                }}
                src={resume_url + "#toolbar=0&navpanes=0&scrollbar=0"}
              >
                Resume could not be loaded.
              </iframe>
            </div>
          </div>
        </ResumeModal>
      )}

      {/* Calendar Modal */}
      {applicant?.calendar_link && (
        <CalendarModal>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold px-6 pt-2">Schedule Interview</h1>
            <iframe
              src={applicant.calendar_link}
              width="100%"
              height="700"
              frameBorder="0"
              style={{
                minWidth: "320px",
                height: "700px",
              }}
            >
              Loading Calendar...
            </iframe>
          </div>
        </CalendarModal>
      )}
    </>
  );
};
