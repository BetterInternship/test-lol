/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-19 04:14:35
 * @ Modified time: 2025-06-19 05:50:31
 * @ Description:
 *
 * What employers see when clicking on an applicant to view.
 * Can also be previewed by applicants, that's why it's a shared component.
 */

import { Job, PublicUser } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
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
  clickable = false,
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
  return (
    <div className="flex flex-col h-full min-h-0">
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
            onClick={() => {
              if (!clickable) return;
              open_resume_modal && open_resume_modal();
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            {applicant.resume ? "View Resume" : "No Resume"}
          </Button>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-50 h-9 text-sm px-3"
            disabled={!clickable || !applicant?.calendly_link}
            onClick={() => {
              if (!clickable) return;
              open_calendly_modal && open_calendly_modal();
            }}
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
            <h3 className="font-semibold text-gray-900 text-sm md:text-base">Academic Background</h3>
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
                <p className="font-medium text-sm md:text-base">Not provided</p>
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
                <p className="font-medium text-sm md:text-base">Not provided</p>
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
                <p className="font-medium text-sm md:text-base">Not provided</p>
              )}
            </div>
          </div>
        </div>

        {/* About the Candidate */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">
            About the Candidate
          </h3>
          <div className="bg-white rounded-lg p-3 md:p-4 border border-gray-200">
            <p className="text-gray-700 text-sm leading-relaxed">
              {applicant?.bio ||
                "No bio provided. The candidate has not added any information about themselves yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
