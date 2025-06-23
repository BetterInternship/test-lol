/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-19 04:14:35
 * @ Modified time: 2025-06-19 05:50:31
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
import {
  Award,
  Calendar,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";

export const ApplicantModalContent = ({
  applicant = {} as Partial<PublicUser>,
  clickable = true,
  open_resume_modal,
  open_calendly_modal,
  job = {} as Partial<Job>,
}: {
  applicant?: Partial<PublicUser>;
  clickable?: boolean;
  open_resume_modal?: () => void;
  open_calendly_modal?: () => void;
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

  // Calendly modal setup
  const {
    open: open_internal_calendly_modal,
    close: close_calendly_modal,
    Modal: CalendlyModal,
  } = useModal("calendly-modal");

  // Resume URL management
  const [resume_route, set_resume_route] = useState("");

  const get_user_resume_url = useCallback(
    async () => user_service.get_user_resume_url(applicant?.id ?? ""),
    [applicant?.id]
  );

  const { url: resume_url, sync: sync_resume_url } = useFile({
    fetch: get_user_resume_url,
    route: resume_route,
  });

  // Set the resume route when applicant changes
  useEffect(() => {
    if (applicant?.id) {
      set_resume_route(`/users/${applicant.id}/resume`);
    }
  }, [applicant?.id]);

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

  // Handle calendly button click
  const handleCalendlyClick = () => {
    if (!clickable || !applicant?.calendly_link) return;

    if (open_calendly_modal) {
      // Use external modal handler if provided
      open_calendly_modal();
    } else {
      // Use internal modal
      open_internal_calendly_modal();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full min-h-0 max-h-[80vh]">
        {/* Fixed Header Section - Not Scrollable */}
        <div className="flex-shrink-0 px-4 md:px-8 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900 mb-2 line-clamp-2">
            {applicant?.full_name || "No Name"}
          </h1>
          <p className="text-gray-600 mb-3 text-sm md:text-base line-clamp-2">
            Applying for {job?.title ?? "Sample Position"}{" "}
            {job?.type !== undefined && job?.type !== null
              ? `• ${to_job_type_name(job.type)}`
              : ""}
          </p>

          {/* Indicate if taking for credit */}
          {applicant.taking_for_credit && (
            <p className="text-gray-900 font-medium text-sm mb-3">
              <span className="inline-flex items-center gap-2 text-green-700">
                <Award className="w-4 h-4" />
                Taking for credit
              </span>
            </p>
          )}

          {/* Quick Action Buttons - Fixed at top */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white h-9 text-sm px-3"
              disabled={!clickable || !applicant.resume}
              onClick={handleResumeClick}
            >
              <FileText className="h-4 w-4 mr-2" />
              {applicant.resume ? "View Resume" : "No Resume"}
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 h-9 text-sm px-3"
              disabled={!clickable || !applicant?.calendly_link}
              onClick={handleCalendlyClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {applicant?.calendly_link ? "Schedule" : "No Calendly"}
            </Button>
          </div>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-1 overflow-y-auto min-h-0 px-4 md:px-8 py-4">
          {/* Academic Background Card */}
          <div className="bg-blue-50 rounded-lg p-3 md:p-6 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Academic Background
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Program</p>
                <p className="font-medium text-sm md:text-base">
                  {to_college_name(applicant?.college)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Institution</p>
                <p className="font-medium text-sm md:text-base">DLSU Manila</p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Year Level</p>
                <p className="font-medium text-sm md:text-base">
                  {to_level_name(applicant?.year_level)}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Email</p>
                <p className="font-medium text-sm md:text-base break-all">
                  {applicant?.email || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Links */}
          <div className="bg-gray-50 rounded-lg p-3 md:p-6 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                Contact & Professional Links
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-sm md:text-base">
                  {applicant?.phone_number || "Not provided"}
                </p>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">Portfolio</p>
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
                    className="text-blue-600 hover:underline font-medium text-sm break-all"
                  >
                    View Portfolio
                  </a>
                ) : (
                  <p className="font-medium text-sm md:text-base">
                    Not provided
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">GitHub</p>
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
                    className="text-blue-600 hover:underline font-medium text-sm break-all"
                  >
                    View GitHub
                  </a>
                ) : (
                  <p className="font-medium text-sm md:text-base">
                    Not provided
                  </p>
                )}
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-500">LinkedIn</p>
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
                    className="text-blue-600 hover:underline font-medium text-sm break-all"
                  >
                    View LinkedIn
                  </a>
                ) : (
                  <p className="font-medium text-sm md:text-base">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* About the Candidate - Only show if bio exists */}
          {applicant?.bio && applicant.bio.trim() && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">
                About the Candidate
              </h3>
              <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {applicant.bio}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resume Modal */}
      {resume_url.length && (
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

      {/* Calendly Modal */}
      {applicant?.calendly_link && (
        <CalendlyModal>
          <div className="space-y-4">
            <h1 className="text-2xl font-bold px-6 pt-2">Schedule Interview</h1>
            <iframe
              src={applicant.calendly_link}
              width="100%"
              height="700"
              frameBorder="0"
              style={{
                minWidth: "320px",
                height: "700px",
              }}
            >
              Loading Calendly...
            </iframe>
          </div>
        </CalendlyModal>
      )}
    </>
  );
};
