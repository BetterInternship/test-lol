"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  HiringData,
  FeedbackData,
  CompanyData,
  InternshipDataView,
  InternshipDataTableProps,
  Department,
  CompanyName,
  AcademicYear,
} from "@/types";
import { getHiringTableColumns } from "./hiring-columns";
import { getFeedbackTableColumns } from "./feedback-columns";
import { getCompanyTableColumns } from "./company-columns";

import { EnhancedTable } from "@/components/school/ui/enhanced-table/composition-pattern";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/school/ui/tabs";
import { Button } from "@/components/school/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/school/ui/select";
import { Card } from "@/components/school/ui/card";
import { Filter as FilterIcon, X as ClearFilterIcon } from "lucide-react";
import { AcademicYearPicker } from "./academic-year-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/school/ui/popover";
import DebouncedSearchInput from "@/components/school/debounced-search-input";
import { Badge } from "@/components/school/ui/badge";
import { toast } from "sonner";
import { checkAcademicYearMatch, getSanitizedFilterValue } from "@/lib/utils";

export function InternshipDataTable({
  initialHiringData,
  initialFeedbackData,
  initialCompanyData,
  availableDepartments,
  availableCompanies,
  availableAcademicYears,
}: InternshipDataTableProps) {
  const [activeView, setActiveView] = useState<InternshipDataView>("hiring");
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = useCallback(
    (data: HiringData | FeedbackData | CompanyData) => {
      // Implement edit logic here
      toast.info("Editing internship data");
    },
    [],
  );
  const handleViewDetails = useCallback(
    (data: HiringData | FeedbackData | CompanyData) => {
      // Implement view details logic here
      toast.info("Viewing internship details");
    },
    [],
  );

  const [filters, setFilters] = useState<{
    department?: Department | "all";
    company?: CompanyName | "all";
    academicYear?: AcademicYear | "all";
  }>({
    department: "all",
    company: "all",
    academicYear: "all",
  });

  const handleFilterChange = <K extends keyof typeof filters>(
    filterName: K,
    value: (typeof filters)[K],
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearAllFilters = useCallback(() => {
    setFilters({
      department: "all",
      company: "all",
      academicYear: "all",
    });
    setSearchTerm("");
  }, []);

  const hiringColumns = useMemo(
    () =>
      getHiringTableColumns({
        onEdit: handleEdit,
        onViewDetails: handleViewDetails,
      }),
    [],
  );
  const feedbackColumns = useMemo(
    () =>
      getFeedbackTableColumns({
        onEdit: handleEdit,
        onViewDetails: handleViewDetails,
      }),
    [],
  );
  const companyColumns = useMemo(
    () =>
      getCompanyTableColumns({
        onEdit: handleEdit,
        onViewDetails: handleViewDetails,
      }),
    [],
  );

  const filteredHiringData = useMemo(() => {
    return initialHiringData.filter((item) => {
      const termMatch = searchTerm
        ? item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.program.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const deptMatch =
        filters.department === "all" ||
        !filters.department || // Handle undefined case
        item.program.toLowerCase().includes(filters.department.toLowerCase());
      const companyMatch =
        filters.company === "all" ||
        !filters.company ||
        item.companyName === filters.company;
      const academicYearMatch = checkAcademicYearMatch(
        item.applicationDate,
        filters.academicYear,
      );

      return termMatch && deptMatch && companyMatch && academicYearMatch;
    });
  }, [
    initialHiringData,
    searchTerm,
    filters.department,
    filters.company,
    filters.academicYear,
  ]);

  const filteredFeedbackData = useMemo(() => {
    return initialFeedbackData.filter((item) => {
      const termMatch = searchTerm
        ? item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.program.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const deptMatch =
        filters.department === "all" ||
        !filters.department ||
        item.program.toLowerCase().includes(filters.department.toLowerCase());
      const academicYearMatch = checkAcademicYearMatch(
        item.startDateOfInternship,
        filters.academicYear,
      );

      return termMatch && deptMatch && academicYearMatch;
    });
  }, [
    initialFeedbackData,
    searchTerm,
    filters.department,
    filters.academicYear,
  ]);

  const filteredCompanyData = useMemo(() => {
    return initialCompanyData.filter((item) => {
      const termMatch = searchTerm
        ? item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const companyMatch =
        filters.company === "all" ||
        !filters.company ||
        item.companyName === filters.company;
      // Assuming MOA date is relevant for academic year for companies
      const academicYearMatch = checkAcademicYearMatch(
        item.moaDate,
        filters.academicYear,
      );

      return termMatch && companyMatch && academicYearMatch;
    });
  }, [initialCompanyData, searchTerm, filters.company, filters.academicYear]);

  const currentData = useMemo(() => {
    switch (activeView) {
      case "hiring":
        return filteredHiringData;
      case "companies":
        return filteredCompanyData;
      case "feedback":
        return filteredFeedbackData;
      default:
        return [];
    }
  }, [
    activeView,
    filteredHiringData,
    filteredFeedbackData,
    filteredCompanyData,
  ]);

  const currentColumns = useMemo(() => {
    switch (activeView) {
      case "hiring":
        return hiringColumns;
      case "feedback":
        return feedbackColumns;
      case "companies":
        return companyColumns;
      default:
        return [];
    }
  }, [activeView, hiringColumns, feedbackColumns, companyColumns]);

  const viewTitles: Record<InternshipDataView, string> = {
    hiring: "Hiring Records",
    feedback: "Internship Feedback",
    companies: "Partner Companies",
  };

  const activeFiltersCount =
    Object.values(filters).filter((f) => f && f !== "all").length +
    (searchTerm ? 1 : 0);

  const exportFileNamePrefix = useMemo(() => {
    const parts: string[] = [`internship_${activeView}`];
    if (searchTerm) {
      parts.push(`search-${getSanitizedFilterValue(searchTerm)}`);
    }
    if (filters.department && filters.department !== "all") {
      parts.push(`dept-${getSanitizedFilterValue(filters.department)}`);
    }
    if (filters.company && filters.company !== "all") {
      parts.push(`co-${getSanitizedFilterValue(filters.company)}`);
    }
    if (filters.academicYear && filters.academicYear !== "all") {
      parts.push(`ay-${filters.academicYear}`);
    }
    return parts.join("_");
  }, [
    activeView,
    searchTerm,
    filters.department,
    filters.company,
    filters.academicYear,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Internship Data Overview: {viewTitles[activeView]}
        </h1>
      </div>

      <Tabs
        value={activeView}
        onValueChange={(value) => setActiveView(value as InternshipDataView)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
          <TabsTrigger value="hiring">Hiring</TabsTrigger>
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <EnhancedTable.Root
          data={currentData}
          columns={currentColumns as any}
          initialData={{ pagination: { pageIndex: 0, pageSize: 10 } }}
        >
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
              <DebouncedSearchInput
                parentDebouncedTerm={searchTerm}
                onDebouncedChange={setSearchTerm}
                placeholder={`Search in ${viewTitles[activeView].toLowerCase()}...`}
                className="w-full md:max-w-sm"
              />
              <div className="flex w-full justify-end gap-2 md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <FilterIcon className="mr-2 h-4 w-4" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-screen max-w-xs space-y-4 p-4 sm:max-w-sm"
                    align="end"
                  >
                    <h4 className="font-medium leading-none">Apply Filters</h4>
                    <div>
                      <label className="text-sm font-medium">Department</label>
                      <Select
                        value={filters.department}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "department",
                            value as Department | "all",
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {availableDepartments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Company</label>
                      <Select
                        value={filters.company}
                        onValueChange={(value) =>
                          handleFilterChange(
                            "company",
                            value as CompanyName | "all",
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Companies</SelectItem>
                          {availableCompanies.map((comp) => (
                            <SelectItem key={comp} value={comp}>
                              {comp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        Academic Year
                      </label>
                      <AcademicYearPicker
                        value={filters.academicYear}
                        onChange={(value) =>
                          handleFilterChange("academicYear", value)
                        }
                        years={availableAcademicYears}
                      />
                    </div>
                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        onClick={clearAllFilters}
                        className="w-full text-sm"
                      >
                        <ClearFilterIcon className="mr-2 h-4 w-4" /> Clear All
                        Filters
                      </Button>
                    )}
                  </PopoverContent>
                </Popover>
                <EnhancedTable.Toolbar.ExportTable
                  fileNamePrefix={exportFileNamePrefix}
                />
              </div>
            </div>
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span>Active filters:</span>
                {searchTerm && (
                  <Badge variant="outline">Search: "{searchTerm}"</Badge>
                )}
                {filters.department !== "all" && (
                  <Badge variant="outline">Dept: {filters.department}</Badge>
                )}
                {filters.company !== "all" && (
                  <Badge variant="outline">Company: {filters.company}</Badge>
                )}
                {filters.academicYear !== "all" && (
                  <Badge variant="outline">AY: {filters.academicYear}</Badge>
                )}
                <Button
                  variant="link"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-auto p-0 text-destructive"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <TabsContent
            value="hiring"
            forceMount={true}
            className={activeView !== "hiring" ? "hidden" : ""}
          >
            <Card className="overflow-hidden">
              <div
                className={activeView === "feedback" ? "overflow-x-auto" : ""}
              >
                <EnhancedTable.Table
                  className={activeView === "feedback" ? "min-w-[1800px]" : ""}
                >
                  <EnhancedTable.Header />
                  <EnhancedTable.Body
                    emptyStateMessage={`No ${viewTitles.hiring.toLowerCase()} found.`}
                  />
                </EnhancedTable.Table>
              </div>
            </Card>
          </TabsContent>
          <TabsContent
            value="feedback"
            forceMount={true}
            className={activeView !== "feedback" ? "hidden" : ""}
          >
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <EnhancedTable.Table className="min-w-[2000px]">
                  <EnhancedTable.Header />
                  <EnhancedTable.Body
                    emptyStateMessage={`No ${viewTitles.feedback.toLowerCase()} found.`}
                  />
                </EnhancedTable.Table>
              </div>
            </Card>
          </TabsContent>
          <TabsContent
            value="companies"
            forceMount={true}
            className={activeView !== "companies" ? "hidden" : ""}
          >
            <Card className="overflow-hidden">
              <div
                className={activeView === "feedback" ? "overflow-x-auto" : ""}
              >
                <EnhancedTable.Table
                  className={activeView === "feedback" ? "min-w-[1800px]" : ""}
                >
                  <EnhancedTable.Header />
                  <EnhancedTable.Body
                    emptyStateMessage={`No ${viewTitles.companies.toLowerCase()} found.`}
                  />
                </EnhancedTable.Table>
              </div>
            </Card>
          </TabsContent>
          <EnhancedTable.Pagination options={[10, 25, 50, 100]} />
        </EnhancedTable.Root>
      </Tabs>
    </div>
  );
}
