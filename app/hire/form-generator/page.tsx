"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  Check,
  ArrowLeft,
  Users,
  FileCheck,
} from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <Suspense>
      <FormGenerator></FormGenerator>
    </Suspense>
  );
}

function FormGenerator() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formType = searchParams.get("form");

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState({
    "All Students": false,
    "Bowei Gai": true,
    "Sherwin Yaun": false,
    "Andrew Pagulayan": false,
    "Malks david": false,
    "Sarah Johnson": false,
    "Michael Chen": false,
    "Emily Davis": false,
    "John Smith": false,
    "Lisa Martinez": false,
    "Tom Anderson": false,
    "Maria Rodriguez": false,
    "Kevin Lee": false,
    "Anna Taylor": false,
    "Chris Brown": false,
    "Jessica Wang": false,
    "David Miller": false,
    "Rachel Green": false,
    "James Wilson": false,
    "Nicole Kim": false,
    "Ryan Thompson": false,
    "Amanda Chen": false,
    "Brandon Lee": false,
    "Stephanie Liu": false,
    "Carlos Garcia": false,
    "Michelle Nguyen": false,
    "Matthew Jones": false,
    "Samantha Park": false,
    "Daniel Rodriguez": false,
    "Ashley Williams": false,
    "Alex Turner": false,
    "Olivia Zhang": false,
    "Nathan Cooper": false,
    "Isabella Moore": false,
    "Tyler Johnson": false,
    "Grace Lim": false,
    "Joshua Martinez": false,
    "Maya Patel": false,
    "Ethan Davis": false,
    "Sophia Chen": false,
  });

  // School mapping for students
  const studentSchools = {
    "Bowei Gai": "DLSU",
    "Sherwin Yaun": "DLSU",
    "Andrew Pagulayan": "DLSU",
    "Malks david": "DLSU",
    "Sarah Johnson": "ATENEO",
    "Michael Chen": "DLSU",
    "Emily Davis": "ATENEO",
    "John Smith": "UST",
    "Lisa Martinez": "DLSU",
    "Tom Anderson": "ATENEO",
    "Maria Rodriguez": "UST",
    "Kevin Lee": "DLSU",
    "Anna Taylor": "ATENEO",
    "Chris Brown": "DLSU",
    "Jessica Wang": "UST",
    "David Miller": "ATENEO",
    "Rachel Green": "DLSU",
    "James Wilson": "UST",
    "Nicole Kim": "ATENEO",
    "Ryan Thompson": "DLSU",
    "Amanda Chen": "DLSU",
    "Brandon Lee": "UST",
    "Stephanie Liu": "ATENEO",
    "Carlos Garcia": "DLSU",
    "Michelle Nguyen": "UST",
    "Matthew Jones": "ATENEO",
    "Samantha Park": "DLSU",
    "Daniel Rodriguez": "UST",
    "Ashley Williams": "ATENEO",
    "Alex Turner": "DLSU",
    "Olivia Zhang": "UST",
    "Nathan Cooper": "ATENEO",
    "Isabella Moore": "DLSU",
    "Tyler Johnson": "UST",
    "Grace Lim": "ATENEO",
    "Joshua Martinez": "DLSU",
    "Maya Patel": "UST",
    "Ethan Davis": "ATENEO",
    "Sophia Chen": "DLSU",
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const handleStudentToggle = (student: string) => {
    if (student === "All Students") {
      const newValue = !selectedStudents["All Students"];
      const newSelected = Object.keys(selectedStudents).reduce((acc, key) => {
        acc[key] = newValue;
        return acc;
      }, {} as typeof selectedStudents);
      setSelectedStudents(newSelected);
    } else {
      const newSelected = {
        ...selectedStudents,
        [student]: !selectedStudents[student],
      };
      const individualStudents = Object.keys(newSelected).filter(
        (key) => key !== "All Students"
      );
      const allIndividualSelected = individualStudents.every(
        (key) => newSelected[key]
      );
      newSelected["All Students"] = allIndividualSelected;
      setSelectedStudents(newSelected);
    }
  };

  const getSelectedCount = () => {
    return Object.entries(selectedStudents).filter(
      ([student, isSelected]) => isSelected && student !== "All Students"
    ).length;
  };

  const handleGenerate = () => {
    console.log("Generate button clicked!");

    const selectedStudentsList = Object.entries(selectedStudents)
      .filter(
        ([student, isSelected]) => isSelected && student !== "All Students"
      )
      .map(([student]) => student);

    console.log("Selected students:", selectedStudentsList);

    // Check if any students are selected
    if (selectedStudentsList.length === 0) {
      alert("Please select at least one student before generating.");
      return;
    }

    console.log("Starting generation process...");
    // Start generating process
    setIsGenerating(true);

    // Wait 2 seconds then navigate to download page
    setTimeout(() => {
      console.log("Navigating to download page...");
      window.location.href = "/download";
    }, 2000);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <div className="w-64 border-r bg-white/80 backdrop-blur-sm flex flex-col shadow-lg">
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
              Applications
            </Link>
            <Link
              href="/listings"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <FileText className="h-5 w-5" />
              My Listings
            </Link>
            <Link
              href="/forms-automation"
              className="flex items-center gap-3 text-gray-700 hover:text-gray-900 p-3 rounded-lg hover:bg-white transition-colors"
            >
              <FileEdit className="h-5 w-5" />
              Forms Automation
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="flex justify-between items-center p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="h-10 w-10 p-0 rounded-full hover:bg-blue-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {formType || "Forms"}
                </h1>
                <p className="text-sm text-gray-600">
                  Generate pre-filled forms for selected students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/hire/company-profile">
                      <Building2 className="mr-2 h-4 w-4" />
                      <span>Edit Company Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/hire/add-users">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Add Users</span>
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
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl flex flex-col h-full">
            {/* Minimalistic Student Selection */}
            <div
              className="bg-white rounded-lg border border-gray-200 overflow-hidden flex-1 flex flex-col max-h-[calc(100vh-200px)]"
              data-tour="student-grid"
            >
              {/* Simple Header */}
              <div className="bg-gray-50 p-4 border-b" data-tour="form-preview">
                <h2 className="text-lg font-semibold text-gray-900">
                  Select Students
                </h2>
                <p className="text-sm text-gray-600">
                  Choose which students to generate forms for
                </p>
              </div>

              <div className="p-4 flex flex-col">
                {/* Select All Checkbox */}
                <label className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    checked={selectedStudents["All Students"]}
                    onChange={() => handleStudentToggle("All Students")}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="font-medium text-gray-900">
                    Select All Students
                  </span>
                </label>

                <hr className="my-3" />

                {/* Individual Students Grid */}
                <div className="overflow-y-auto max-h-96">
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(selectedStudents)
                      .filter(([student]) => student !== "All Students")
                      .map(([student, isSelected]) => (
                        <label
                          key={student}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded border border-gray-200"
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleStudentToggle(student)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                              {student
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student}
                              </div>
                              <div className="text-xs text-gray-500">
                                (
                                {
                                  studentSchools[
                                    student as keyof typeof studentSchools
                                  ]
                                }
                                )
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Generate Button */}
            <div
              className="flex justify-center pt-4"
              data-tour="download-options"
            >
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || getSelectedCount() === 0}
                className={`px-6 py-2 rounded-md font-medium ${
                  isGenerating
                    ? "bg-gray-400 cursor-not-allowed"
                    : getSelectedCount() === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isGenerating ? (
                  <span>Generating...</span>
                ) : (
                  <span>Generate Forms</span>
                )}
              </Button>
            </div>

            {getSelectedCount() === 0 && (
              <p className="text-center text-gray-500 mt-2 text-sm">
                Please select at least one student to generate forms
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
