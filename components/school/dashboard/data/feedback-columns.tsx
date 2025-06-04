"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { FeedbackData } from "@/types";
import { Button } from "@/components/school/ui/button";
import {
  ArrowUpDown,
  CalendarDays,
  MoreHorizontal,
  MessageSquareText,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/school/ui/dropdown-menu";
import { parseDate } from "@/lib/utils";
import ShowTooltip from "@/components/school/show-tooltip";

interface FeedbackColumnActions {
  onEdit: (rowData: FeedbackData) => void;
  onViewDetails: (rowData: FeedbackData) => void;
}

const generateWeeklyFeedbackColumns = (): ColumnDef<FeedbackData>[] => {
  const columns: ColumnDef<FeedbackData>[] = [];
  for (let i = 1; i <= 12; i++) {
    columns.push({
      accessorFn: (row) =>
        (row.weeklyFeedbacks &&
          row.weeklyFeedbacks.find((fb) => fb.weekNumber === i)
            ?.feedbackText) ||
        "N/A",
      id: `week${i}Feedback`,
      header: `Week ${i}`,
      cell: ({ getValue }) => {
        const feedback = getValue() as string;
        return (
          <ShowTooltip content={feedback} side="top">
            <div className="w-48 whitespace-pre-wrap">{feedback}</div>
          </ShowTooltip>
        );
      },
      size: 5000,
    });
  }
  return columns;
};

export const getFeedbackTableColumns = ({
  onEdit,
  onViewDetails,
}: FeedbackColumnActions): ColumnDef<FeedbackData>[] => [
  {
    accessorKey: "studentName",
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <User className="h-4 w-4" />
        Student Name
      </div>
    ),
    size: 200,
  },
  {
    accessorKey: "program",
    header: "Program",
    size: 180,
  },
  {
    accessorKey: "startDateOfInternship",
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <CalendarDays className="h-4 w-4" />
        Start Date
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        {parseDate(row.original.startDateOfInternship, "MMM dd, yyyy")}
      </div>
    ),
    meta: { export: { format: "MMMM dd, yyyy" } },
    size: 150,
  },
  {
    accessorKey: "overallFeedback",
    header: "Overall Feedback",
    cell: ({ row }) => (
      <ShowTooltip content={row.original.overallFeedback} side="top">
        <div>{row.original.overallFeedback}</div>
      </ShowTooltip>
    ),
    size: 200,
  },
  {
    accessorKey: "tasksCompleted",
    header: "Tasks Completed", // Simple text header
    cell: ({ row }) => (
      <ShowTooltip content={row.original.tasksCompleted} side="top">
        <div>{row.original.tasksCompleted}</div>
      </ShowTooltip>
    ),
    size: 200,
  },
  {
    accessorKey: "lessonsLearned",
    header: "Lessons Learned", // Simple text header
    cell: ({ row }) => (
      <ShowTooltip content={row.original.lessonsLearned} side="top">
        <div>{row.original.lessonsLearned}</div>
      </ShowTooltip>
    ),
    size: 200,
  },
  {
    accessorKey: "areaOfImprovement",
    header: "Area of Improvement",
    cell: ({ row }) => (
      <ShowTooltip content={row.original.areaOfImprovement} side="top">
        <div>{row.original.areaOfImprovement}</div>
      </ShowTooltip>
    ),
    size: 200,
  },
  ...generateWeeklyFeedbackColumns(),
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="sticky right-0 p-2 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onViewDetails(data)}>
                <MessageSquareText className="mr-2 h-4 w-4" /> View Full
                Feedback
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(data)}>
                Edit Record
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    meta: { export: false },
    size: 100,
  },
];
