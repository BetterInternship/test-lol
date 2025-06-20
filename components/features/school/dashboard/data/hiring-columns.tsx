"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { HiringData, JobMode, Decision } from "@/types";
import { Button } from "@/components/features/school/ui/button";
import {
  Briefcase,
  CircleHelp,
  ExternalLink,
  FileCheck2,
  FileText,
  Hourglass,
  MapPin,
  MoreHorizontal,
  UserCheck,
  UserRound,
  UserX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/features/school/ui/dropdown-menu";
import ShowTooltip from "@/components/features/school/show-tooltip";
import { parseDate } from "@/lib/utils";

const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number") return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

const getJobModeIcon = (mode: JobMode) => {
  switch (mode) {
    case "Remote":
      return <Briefcase className="mx-auto h-4 w-4 text-blue-500" />;
    case "In-Person":
      return <MapPin className="mx-auto h-4 w-4 text-green-500" />;
    case "Hybrid":
      return <UserRound className="mx-auto h-4 w-4 text-purple-500" />;
    default:
      return null;
  }
};

const getDecisionBadge = (decision: Decision): JSX.Element => {
  switch (decision) {
    case "Accepted":
      return (
        <ShowTooltip content={decision}>
          <UserCheck className="mx-auto h-5 w-5 text-green-600" />
        </ShowTooltip>
      );
    case "Offer Received":
      return (
        <ShowTooltip content={decision}>
          <FileCheck2 className="mx-auto h-5 w-5 text-blue-600" />
        </ShowTooltip>
      );
    case "Pending":
      return (
        <ShowTooltip content={decision}>
          <Hourglass className="mx-auto h-5 w-5 text-yellow-500" />
        </ShowTooltip>
      );
    case "Rejected":
      return (
        <ShowTooltip content={decision}>
          <UserX className="mx-auto h-5 w-5 text-red-600" />
        </ShowTooltip>
      );
    default:
      return (
        <ShowTooltip content={decision || "Unknown Status"}>
          <CircleHelp className="h-5 w-5 text-gray-500" />
        </ShowTooltip>
      );
  }
};

interface HiringColumnActions {
  onEdit: (rowData: HiringData) => void;
  onViewDetails: (rowData: HiringData) => void;
}

export const getHiringTableColumns = ({
  onEdit,
  onViewDetails,
}: HiringColumnActions): ColumnDef<HiringData>[] => [
  {
    accessorKey: "studentName",
    header: "Student Name",
  },
  {
    accessorKey: "program",
    header: "Program",
    enableSorting: false,
    size: 500,
  },
  {
    accessorKey: "companyName",
    header: "Company",
    enableSorting: false,
    size: 500,
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
    enableSorting: false,
    size: 500,
  },
  {
    accessorKey: "jobPosition",
    header: "Position",
    enableSorting: false,
    size: 500,
  },
  {
    accessorKey: "jobPay",
    header: "Pay",
    enableSorting: false,
    cell: ({ row }) => formatCurrency(row.original.jobPay),
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    accessorKey: "jobMode",
    header: "Mode",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">
        <ShowTooltip content={row.original.jobMode}>
          {getJobModeIcon(row.original.jobMode)}
        </ShowTooltip>
      </div>
    ),
    size: 300,
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    accessorKey: "jobLink",
    header: "Job Link",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.jobLink ? (
        <Button variant="link" asChild className="h-auto p-0">
          <a
            href={row.original.jobLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-1 h-4 w-4" /> View
          </a>
        </Button>
      ) : (
        "N/A"
      ),
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    accessorKey: "applicationDate",
    header: "Applied",
    enableSorting: false,
    cell: ({ row }) => parseDate(row.original.applicationDate, "MMM dd, yyyy"),
    meta: { export: { format: "MMMM dd, yyyy" } },
  },
  {
    accessorKey: "decisionDate",
    header: "Decision Date",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.decisionDate
        ? parseDate(row.original.decisionDate, "MMM dd, yyyy")
        : "N/A",
    meta: { export: { format: "MMMM dd, yyyy" } },
  },
  {
    accessorKey: "decision",
    header: "Decision",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">
        {getDecisionBadge(row.original.decision)}
      </div>
    ),
  },
  {
    accessorKey: "moaSubmissionDate",
    enableSorting: false,
    header: () => <div className="text-center">MOA Sub.</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.moaSubmissionDate ? (
          <ShowTooltip
            content={`MOA Submitted: ${parseDate(row.original.moaSubmissionDate)}`}
          >
            <FileText className="mx-auto h-5 w-5 text-green-600" />
          </ShowTooltip>
        ) : (
          <ShowTooltip content="MOA Not Submitted">
            <FileText className="mx-auto h-5 w-5 text-gray-400" />
          </ShowTooltip>
        )}
      </div>
    ),
    meta: { export: { format: "MMMM dd, yyyy" } },
  },
  {
    accessorKey: "jobDescriptionSubmissionDate",
    header: () => <div className="text-center">JD Sub.</div>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.jobDescriptionSubmissionDate ? (
          <ShowTooltip
            content={`JD Submitted: ${parseDate(row.original.jobDescriptionSubmissionDate)}`}
          >
            <FileText className="mx-auto h-5 w-5 text-green-600" />
          </ShowTooltip>
        ) : (
          <ShowTooltip content="JD Not Submitted">
            <FileText className="mx-auto h-5 w-5 text-gray-400" />
          </ShowTooltip>
        )}
      </div>
    ),
    meta: { export: { format: "MMMM dd, yyyy" } },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="text-right">
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
                View Details
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
  },
];
