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
    <div className="flex flex-col h-full">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {applicant?.full_name || "No Name"}
          </h1>
          <p className="text-gray-600 mb-4 md:mb-6">
            Applying for {job?.title ?? "Sample Position"}{" "}
            {job?.type !== undefined && job?.type !== null
              ? `• ${to_job_type_name(job.type)}`
              : ""}
          </p>

          {/* Indicate if taking for credit */}
          {applicant.taking_for_credit && (
            <p className="text-gray-900 font-medium text-sm mb-4">
              <span className="inline-flex items-center gap-2 text-green-700">
                <Award className="w-4 h-4" />
                Taking for credit
              </span>
            </p>
          )}

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!clickable || !applicant.resume}
              onClick={() => {
                if (!clickable) return;
                open_resume_modal && open_resume_modal();
              }}
            >
              <FileText className="h-4 w-4 mr-2" />
              {applicant.resume ? "View Resume" : "No Resume Uploaded"}
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={!clickable || !applicant?.calendly_link}
              onClick={() => {
                if (!clickable) return;
                open_calendly_modal && open_calendly_modal();
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {applicant?.calendly_link
                ? "Schedule Interview"
                : "No Calendly Link"}
            </Button>
          </div>
        </div>

        {/* Academic Background Card */}
        <div className="bg-blue-50 rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Academic Background</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">
                {to_college_name(applicant?.college)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Institution</p>
              <p className="font-medium">DLSU Manila</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year Level</p>
              <p className="font-medium">
                {to_level_name(applicant?.year_level)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">
                {applicant?.email || "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Contact & Links */}
        <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <ExternalLink className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">
              Contact & Professional Links
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium">
                {applicant?.phone_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Portfolio</p>
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
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View Portfolio
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">GitHub</p>
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
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View GitHub
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">LinkedIn</p>
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
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  View LinkedIn
                </a>
              ) : (
                <p className="font-medium">Not provided</p>
              )}
            </div>
          </div>
        </div>

        {/* About the Candidate */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">
              About the Candidate
            </h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700 text-sm leading-relaxed">
                {applicant?.bio ||
                  "No bio provided. The candidate has not added any information about themselves yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
