"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  BarChart3,
  FileText,
  Building2,
  UserPlus,
  LogOut,
  FileEdit,
  Settings,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function RandomInfo() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    // Company Project Details
    projectTitle: "",
    projectDescription: "",
    numberOfStudents: "",
    projectDuration: "",
    projectActivities: "",
    expectedOutputs: "",

    // Training Plan
    mainTasks: "",
    learningObjectives: "",
    trainingSchedule: "",
  });

  const handleLogout = () => {
    router.push("/login");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = () => {
    // Validate required fields
    const requiredFields = [
      "projectTitle",
      "projectDescription",
      "numberOfStudents",
      "projectDuration",
      "projectActivities",
      "expectedOutputs",
      "mainTasks",
      "learningObjectives",
      "trainingSchedule",
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    alert("Project and training information saved successfully!");
    router.back();
  };

  const handleClearForm = () => {
    const confirmClear = confirm(
      "Are you sure you want to clear all form data? This action cannot be undone."
    );

    if (confirmClear) {
      setFormData({
        projectAssignment: "",
        projectDescription: "",
        numberOfStudents: "",
        projectActivities: "",
        mainTasks: "",
        activitiesForWeek: "",
        majorAccomplishments: "",
        solutionsSuggestions: "",
      });
      alert("Form cleared successfully!");
    }
  };

  return (
    <div className="h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-50 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-800">BetterInternship</h1>
        </div>

        <div className="px-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              My Applications
            </Link>
            <Link
              href="/listings"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <FileText className="h-5 w-5" />
              My Listings
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Random Information
          </h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/company-profile">
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Edit Company Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/forms-automation">
                  <FileEdit className="mr-2 h-4 w-4" />
                  <span>Forms automation</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/add-users">
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add Users</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-6xl mx-auto">
            {/* Back Button */}
            <div className="mb-8">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="h-10 w-10 p-0 border-2 border-gray-300 hover:border-gray-400 bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-12">
              {/* Company Project Details */}
              <div className="bg-white rounded-2xl p-10 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Project Information
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Tell us about the project or work you want students to help
                  with
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="project-title"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Project Title *
                      </Label>
                      <Input
                        id="project-title"
                        value={formData.projectTitle}
                        onChange={(e) =>
                          handleInputChange("projectTitle", e.target.value)
                        }
                        placeholder="e.g., Mobile App Development, Data Analysis Project"
                        className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="number-students"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Number of Students Needed *
                      </Label>
                      <Input
                        id="number-students"
                        type="number"
                        value={formData.numberOfStudents}
                        onChange={(e) =>
                          handleInputChange("numberOfStudents", e.target.value)
                        }
                        placeholder="e.g., 2"
                        className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="project-duration"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Project Duration *
                      </Label>
                      <Input
                        id="project-duration"
                        value={formData.projectDuration}
                        onChange={(e) =>
                          handleInputChange("projectDuration", e.target.value)
                        }
                        placeholder="e.g., 8 weeks, 3 months"
                        className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="project-description"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Project Description *
                      </Label>
                      <Textarea
                        id="project-description"
                        value={formData.projectDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "projectDescription",
                            e.target.value
                          )
                        }
                        placeholder="Describe what the project involves and what students will be working on"
                        className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0 resize-none"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="project-activities"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Main Activities *
                      </Label>
                      <Textarea
                        id="project-activities"
                        value={formData.projectActivities}
                        onChange={(e) =>
                          handleInputChange("projectActivities", e.target.value)
                        }
                        placeholder="List the key tasks students will be doing (e.g., research, coding, testing, documentation)"
                        className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0 resize-none"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="expected-outputs"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Expected Results *
                      </Label>
                      <Input
                        id="expected-outputs"
                        value={formData.expectedOutputs}
                        onChange={(e) =>
                          handleInputChange("expectedOutputs", e.target.value)
                        }
                        placeholder="e.g., Working prototype, Research report, Completed analysis"
                        className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Training & Learning Plan */}
              <div className="bg-white rounded-2xl p-10 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Training & Learning Plan
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  Help us understand how you'll guide and develop the students
                </p>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="main-tasks"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Daily/Weekly Tasks *
                      </Label>
                      <Textarea
                        id="main-tasks"
                        value={formData.mainTasks}
                        onChange={(e) =>
                          handleInputChange("mainTasks", e.target.value)
                        }
                        placeholder="What will students be doing on a typical day or week? (separate tasks with commas)"
                        className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0 resize-none"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="learning-objectives"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Learning Goals *
                      </Label>
                      <Textarea
                        id="learning-objectives"
                        value={formData.learningObjectives}
                        onChange={(e) =>
                          handleInputChange(
                            "learningObjectives",
                            e.target.value
                          )
                        }
                        placeholder="What skills or knowledge should students gain from this experience?"
                        className="w-full h-24 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0 resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="training-schedule"
                        className="text-sm font-medium text-gray-900 mb-2 block"
                      >
                        Training Schedule *
                      </Label>
                      <Textarea
                        id="training-schedule"
                        value={formData.trainingSchedule}
                        onChange={(e) =>
                          handleInputChange("trainingSchedule", e.target.value)
                        }
                        placeholder="How will you onboard and train students? (e.g., first week orientation, weekly check-ins)"
                        className="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-gray-900 focus:ring-0 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-12">
              <Button
                onClick={handleClearForm}
                variant="outline"
                className="px-16 py-4 text-xl border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium"
              >
                Clear Form
              </Button>
              <Button
                onClick={handleContinue}
                className="px-24 py-4 text-xl bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium shadow-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
