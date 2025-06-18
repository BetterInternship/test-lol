"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Calendar,
  FileText,
  User,
  BarChart3,
  ChevronDown,
  Building2,
  FileEdit,
  Search,
} from "lucide-react";
import Link from "next/link";
import ApplicantModal from "@/components/hire/applicant-modal";
import CalendarModal from "@/components/hire/calendar-modal";
import { useEmployerApplications } from "@/hooks/use-employer-api";
import { EmployerApplication } from "@/lib/db/db.types";
import { useRefs } from "@/lib/db/use-refs";
import { GroupableRadioDropdown } from "@/components/ui/dropdown";

export default function Dashboard() {
  const { employer_applications, loading, error } = useEmployerApplications();
  const {
    app_statuses,
    get_college,
    to_college_name,
    to_level_name,
    to_university_name,
  } = useRefs();
  const [selectedApplication, setSelectedApplication] =
    useState<EmployerApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Sorting and filtering states
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [jobSearch, setJobSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");

  // Get unique values for filters
  const uniqueJobs = useMemo(
    () =>
      [
        ...new Set(
          employer_applications
            .map((a) => a.job?.id)
            .filter((a) => a !== undefined)
        ),
      ].sort(),
    []
  );

  // Filter and sort applicants
  const filteredAndSortedApplicants = useMemo(() => {
    let filtered = employer_applications.filter((application) => {
      const jobMatch =
        selectedJobs.length === 0 ||
        selectedJobs.includes(application.job?.id ?? "");
      const statusMatch =
        selectedStatuses.length === 0 ||
        selectedStatuses.includes(application.status ?? "");
      return jobMatch && statusMatch;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField as keyof typeof a] ?? 0;
        let bValue = b[sortField as keyof typeof b] ?? 0;

        if (typeof aValue === "string") aValue = aValue.toLowerCase();
        if (typeof bValue === "string") bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [selectedJobs, selectedStatuses, sortField, sortDirection]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleJobToggle = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const updateStatus = (id: number, newStatus: string) => {
    // !to implement
  };

  const openApplicantModal = (application: EmployerApplication) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  // Filter components
  const MultiSelectFilter = ({
    title,
    options,
    selected,
    onToggle,
    searchValue,
    onSearchChange,
    fieldName,
  }: {
    title: string;
    options: string[];
    selected: string[];
    onToggle: (value: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    fieldName: string;
  }) => {
    const filteredOptions = options.filter((option) =>
      option.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="h-auto p-0 font-semibold">
            <div className="flex items-center gap-2">
              {title} <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSort(fieldName)}
                className="text-xs"
              >
                A-Z {sortField === fieldName && sortDirection === "asc" && "↑"}
                {sortField === fieldName && sortDirection === "desc" && "↓"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Select all filtered options
                  filteredOptions.forEach((option) => {
                    if (!selected.includes(option)) {
                      onToggle(option);
                    }
                  });
                }}
                className="text-xs"
              >
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Clear all selections
                  selected.forEach((option) => onToggle(option));
                }}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${title}-${option}`}
                    checked={selected.includes(option)}
                    onCheckedChange={() => onToggle(option)}
                  />
                  <label
                    htmlFor={`${title}-${option}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>

            {selected.length > 0 && (
              <div className="text-xs text-gray-500 pt-2 border-t">
                {selected.length} selected
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const SortableFilter = ({
    field,
    title,
  }: {
    field: string;
    title: string;
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 font-semibold">
          <div className="flex items-center gap-2">
            {title} <ChevronDown className="h-4 w-4" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48" align="start">
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSort(field)}
            className="w-full justify-start"
          >
            Sort A-Z {sortField === field && sortDirection === "asc" && "↑"}
            {sortField === field && sortDirection === "desc" && "↓"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {/* Sidebar */}
      <div
        className="w-64 border-r bg-gray-50 flex flex-col"
        data-tour="sidebar"
      >
        <div className="p-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">Pages</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-gray-900 bg-white p-3 rounded-lg font-medium cursor-default">
              <BarChart3 className="h-5 w-5" />
              Applications
            </div>
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
        {/* Enhanced Dashboard */}
        <div className="p-6 flex flex-col h-0 flex-1 space-y-6">
          {/* Enhanced Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col flex-1">
            {/* Table Header with Filters */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Applicants
                </h3>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                    Showing {employer_applications.length} of{" "}
                    {employer_applications.length} applicants
                  </div>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[300px]">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <SortableFilter field="name" title="Candidate" />
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[250px]">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <MultiSelectFilter
                          title="Position"
                          options={uniqueJobs}
                          selected={selectedJobs}
                          onToggle={handleJobToggle}
                          searchValue={jobSearch}
                          onSearchChange={setJobSearch}
                          fieldName="job"
                        />
                      </div>
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-700 w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>Resume</span>
                      </div>
                    </th>
                    <th className="text-center px-6 py-4 font-semibold text-gray-700 w-[120px]">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Schedule</span>
                      </div>
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 w-[200px]">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                        <MultiSelectFilter
                          title="Status"
                          options={app_statuses.map((as) => as.name)}
                          selected={selectedStatuses}
                          onToggle={handleStatusToggle}
                          searchValue={statusSearch}
                          onSearchChange={setStatusSearch}
                          fieldName="status"
                        />
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employer_applications.map((application, index) => (
                    <tr
                      key={application.id}
                      className={`border-b border-gray-50 hover:bg-gray-25 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-25"
                      }`}
                    >
                      <td className="px-6 py-4 w-[300px]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {application.user?.full_name}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {application.user?.full_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {to_level_name(application.user?.year_level)} •{" "}
                              {to_college_name(application.user?.college)} •{" "}
                              {to_university_name(
                                get_college(application.user?.college)
                                  ?.university_id
                              )}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 w-[250px]">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            {application.job?.title}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {application.job?.mode}
                        </p>
                      </td>
                      <td className="px-6 py-4 w-[120px] text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => openApplicantModal(application)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 w-[120px] text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors"
                          onClick={() => setIsCalendarOpen(true)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="px-6 py-4 w-[200px]">
                        <GroupableRadioDropdown
                          name="status"
                          options={app_statuses.map((as) => as.name)}
                          on_change={() => alert("Status updated.")}
                        ></GroupableRadioDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Modal */}
      {selectedApplication && (
        <ApplicantModal
          application={selectedApplication}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        applicantName={selectedApplication?.user?.full_name}
      />
    </>
  );
}
