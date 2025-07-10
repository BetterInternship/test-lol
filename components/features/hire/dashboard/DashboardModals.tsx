// Container for all dashboard modals - applicant details, resume viewer, review notes
// Takes modal components and selected application, renders the right content
"use client";

import { FileText, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { EmployerApplication } from "@/lib/db/db.types";
import { getFullName } from "@/lib/utils/user-utils";
import { UserService } from "@/lib/api/services";
import { ApplicantModalContent } from "@/components/shared/applicant-modal";
import { PDFPreview } from "@/components/shared/pdf-preview";
import { ReviewModalContent } from "./ReviewModalContent";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DashboardModalsProps {
  selectedApplication: EmployerApplication | null;
  resumeURL: string;
  ApplicantModal: React.ComponentType<{ children: React.ReactNode }>;
  ChatModal: React.ComponentType<{ children: React.ReactNode }>;
  ResumeModal: React.ComponentType<{ children: React.ReactNode }>;
  ReviewModal: React.ComponentType<{ children: React.ReactNode }>;
  openChatModal: () => void;
  closeApplicantModal: () => void;
  reviewApp: (
    id: string,
    reviewOptions: { review?: string; notes?: string; status?: number }
  ) => void;
  closeReviewModal: () => void;
  syncResumeURL: () => Promise<void>;
  openResumeModal: () => void;
}

export function DashboardModals({
  selectedApplication,
  resumeURL,
  ApplicantModal,
  ResumeModal,
  ReviewModal,
  ChatModal,
  openChatModal,
  closeApplicantModal,
  reviewApp,
  closeReviewModal,
  syncResumeURL,
  openResumeModal,
}: DashboardModalsProps) {
  const [message, setMessage] = useState("");
  return (
    <>
      <ApplicantModal>
        <ApplicantModalContent
          is_employer={true}
          clickable={true}
          pfp_fetcher={async () =>
            UserService.getUserPfpURL(selectedApplication?.user?.id ?? "")
          }
          pfp_route={`/users/${selectedApplication?.user?.id}/pic`}
          applicant={selectedApplication?.user}
          open_chat={() => (openChatModal(), closeApplicantModal())}
          open_calendar={async () => {
            closeApplicantModal();
            window
              ?.open(selectedApplication?.user?.calendar_link ?? "", "_blank")
              ?.focus();
          }}
          open_resume={async () => {
            closeApplicantModal();
            await syncResumeURL();
            openResumeModal();
          }}
          job={selectedApplication?.job}
        />
      </ApplicantModal>

      <ReviewModal>
        {selectedApplication && (
          <ReviewModalContent
            application={selectedApplication}
            reviewApp={async (id, reviewOptions) => {
              await reviewApp(id, reviewOptions);
              // ! lol remove this later on
              selectedApplication.notes = reviewOptions.notes;
            }}
            onClose={closeReviewModal}
          />
        )}
      </ReviewModal>

      <ResumeModal>
        {selectedApplication?.user?.resume ? (
          <div className="h-full flex flex-col">
            <h1 className="font-bold font-heading text-2xl px-6 py-4 text-gray-900">
              {getFullName(selectedApplication?.user)} - Resume
            </h1>
            <PDFPreview url={resumeURL} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 px-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="font-heading font-bold text-2xl mb-4 text-gray-700">
                No Resume Available
              </h1>
              <div className="max-w-md text-center border border-red-200 text-red-600 bg-red-50 rounded-lg p-4">
                This applicant has not uploaded a resume yet.
              </div>
            </div>
          </div>
        )}
      </ResumeModal>

      <ChatModal>
        <div className="relative p-6 py-20 h-full w-full">
          <div className="flex flex-col h-[100%] w-full gap-6">
            <div className="text-4xl font-bold tracking-tight">
              {getFullName(selectedApplication?.user)}
            </div>
            <div className="flex-1 border border-gray-300 rounded-[0.33em] h-full"></div>
            <Textarea
              placeholder="Send a message here..."
              className="w-full h-20 p-3 border-gray-200 rounded-[0.33em] focus:ring-0 focus:ring-transparent resize-none text-sm overflow-y-auto"
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
            />
            <Button size="md">
              Send Message
              <SendHorizonal className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </ChatModal>
    </>
  );
}
