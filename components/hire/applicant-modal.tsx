"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Calendar as CalendarIcon,
  FileText,
} from "lucide-react";
import CalendarModal from "./calendar-modal";
import { EmployerApplication } from "@/lib/db/db.types";

interface ApplicantModalProps {
  application: EmployerApplication;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicantModal({
  application,
  isOpen,
  onClose,
}: ApplicantModalProps) {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] p-0 bg-white overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Applied 16H 58M ago
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {application.user?.full_name}
                </h1>
                <p className="text-gray-600 mb-4 md:mb-6">
                  Applying for {application.job?.title} •{" "}
                  {application.job?.mode}
                </p>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => setIsResumeOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </Button>
                </div>
              </div>

              {/* Academic Background Card */}
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    Academic Background
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Program</p>
                    <p className="font-medium">Computer Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-medium">DLSU Manila</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minor</p>
                    <p className="font-medium">Data Science</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year Level</p>
                    <p className="font-medium">2nd Year Student</p>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Cover Letter
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    I wish to work with you guys more effectively. I have an
                    efficiency with Robotics so I think I would be best suited
                    here.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    About the Candidate
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Your Momma lmaoooo did you actually think that I would apply
                    to your bad company?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Resume Viewer Modal */}
      <Dialog open={isResumeOpen} onOpenChange={setIsResumeOpen}>
        <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] p-4 md:p-6 overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {application.user?.full_name}'s Resume
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 bg-white border rounded-lg p-4 md:p-8 overflow-auto min-h-0">
            {/* Sample Resume Content */}
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-xl md:text-2xl font-bold">
                  {application.user?.full_name}
                </h1>
                <p className="text-gray-600">Computer Science Student</p>
                <p className="text-sm text-gray-500 break-all">
                  john.doe@dlsu.edu.ph | +63 912 345 6789
                </p>
              </div>

              <section className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                  Education
                </h2>
                <div>
                  <h3 className="font-medium">De La Salle University</h3>
                  <p className="text-gray-600">
                    Bachelor of Science in Computer Science
                  </p>
                  <p className="text-sm text-gray-500">
                    2023 - 2027 | Manila, Philippines
                  </p>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                  Experience
                </h2>
                <div className="mb-4">
                  <h3 className="font-medium">Web Development Intern</h3>
                  <p className="text-gray-600">Tech Startup Inc.</p>
                  <p className="text-sm text-gray-500">Summer 2024</p>
                  <ul className="text-sm text-gray-700 mt-2 ml-4 list-disc">
                    <li>
                      Developed responsive web applications using React and
                      Node.js
                    </li>
                    <li>
                      Collaborated with design team to implement UI/UX
                      improvements
                    </li>
                  </ul>
                </div>
              </section>

              <section className="mb-6">
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[
                    "JavaScript",
                    "Python",
                    "React",
                    "Node.js",
                    "SQL",
                    "Git",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">
                  Projects
                </h2>
                <div>
                  <h3 className="font-medium">Task Management App</h3>
                  <p className="text-sm text-gray-700">
                    Built a full-stack task management application with user
                    authentication, real-time updates, and responsive design.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        applicantName={application.user?.full_name}
      />
    </>
  );
}
