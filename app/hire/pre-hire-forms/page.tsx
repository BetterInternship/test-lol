"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  Settings,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function PreHireForms() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("All students");
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
  });

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
      // Check if all individual students are selected
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
              Applications
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
            Generate Pre-Employment Forms
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
          <div className="max-w-5xl mx-auto">
            {/* All students or select student */}
            <div className="mb-8">
              <div className="mb-8">
                <span className="text-xl text-gray-900 font-medium">
                  All students or select student
                </span>
              </div>

              {/* Student Selection Box */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-10 shadow-sm">
                {/* All Students (fixed at top, not scrollable) */}
                <div
                  className="flex items-center gap-5 cursor-pointer mb-6 pb-6 border-b border-gray-200"
                  onClick={() => handleStudentToggle("All Students")}
                >
                  <div
                    className={`w-6 h-6 border-2 rounded ${
                      selectedStudents["All Students"]
                        ? "bg-gray-900 border-gray-900"
                        : "bg-white border-gray-400"
                    } flex items-center justify-center transition-colors`}
                  >
                    {selectedStudents["All Students"] && (
                      <Check className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <span className="text-xl text-gray-900 font-medium">
                    All Students
                  </span>
                </div>

                {/* Individual Students (scrollable area) */}
                <div className="max-h-72 overflow-y-auto pr-2">
                  <div className="space-y-5">
                    {Object.entries(selectedStudents)
                      .filter(([student]) => student !== "All Students")
                      .map(([student, isSelected]) => (
                        <div
                          key={student}
                          className="flex items-center gap-5 cursor-pointer ml-12 hover:bg-gray-50 rounded-lg p-2 -ml-10 pl-12 transition-colors"
                          onClick={() => handleStudentToggle(student)}
                        >
                          <div
                            className={`w-6 h-6 border-2 rounded ${
                              isSelected
                                ? "bg-gray-900 border-gray-900"
                                : "bg-white border-gray-400"
                            } flex items-center justify-center transition-colors`}
                          >
                            {isSelected && (
                              <Check className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-xl text-gray-900">
                            {student}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="px-20 py-4 text-xl bg-white border border-gray-300 hover:bg-gray-50 rounded-xl text-gray-900 font-medium shadow-sm"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
