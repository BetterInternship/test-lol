"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { CompanyData } from "@/types";
import { Button } from "@/components/school/ui/button";
import {
  ArrowUpDown,
  Building,
  CalendarDays,
  MoreHorizontal,
  Phone,
  Star,
  Users,
  UserCircle,
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

interface CompanyColumnActions {
  onEdit: (rowData: CompanyData) => void;
  onViewDetails: (rowData: CompanyData) => void;
}

const renderStudentList = (students: CompanyData["activeStudents"]) => {
  if (!students || students.length === 0) return "N/A";
  const displayCount = 2;
  const names = students
    .slice(0, displayCount)
    .map((s) => s.name)
    .join(", ");
  const remaining = students.length - displayCount;
  return (
    <ShowTooltip content={students.map((s) => s.name).join("\n")}>
      <span>
        {names}
        {remaining > 0 && ` +${remaining} more`}
      </span>
    </ShowTooltip>
  );
};

const renderRating = (rating?: number) => {
  const displayCount = rating || 0;
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < displayCount || 0 ? "fill-yellow-400 text-yellow-500" : "text-gray-300"}`}
        />
      ))}
      <span className="ml-1 text-xs">({displayCount.toFixed(1)})</span>
    </div>
  );
};

export const getCompanyTableColumns = ({
  onEdit,
  onViewDetails,
}: CompanyColumnActions): ColumnDef<CompanyData>[] => [
  {
    accessorKey: "companyName",
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <Building className="h-4 w-4 text-muted-foreground" />
        Company Name
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center font-medium">
        {row.original.companyName}
      </div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    enableSorting: false,
    cell: ({ row }) => (
      <ShowTooltip content={row.original.address}>
        <div className="w-48 truncate">{row.original.address}</div>
      </ShowTooltip>
    ),
  },
  {
    accessorKey: "phone",
    enableSorting: false,
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <Phone className="h-4 w-4" />
        Company Phone
      </div>
    ),
    cell: ({ row }) =>
      row.original.phone ? (
        <div className="flex w-36 items-center">{row.original.phone}</div>
      ) : (
        "N/A"
      ),
  },
  {
    accessorKey: "moaDate",
    header: ({ column }) => (
      <div className="flex flex-row items-center gap-x-2">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        MoA Date
      </div>
    ),
    cell: ({ row }) =>
      row.original.moaDate ? (
        <div className="flex items-center">
          {parseDate(row.original.moaDate, "MMM dd, yyyy")}
        </div>
      ) : (
        "N/A"
      ),
    meta: { export: { format: "MMMM dd, yyyy" } },
  },
  {
    accessorKey: "contactPersonName",
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <UserCircle className="h-4 w-4" />
        Contact Person
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">{row.original.contactPersonName}</div>
    ),
  },
  {
    accessorKey: "contactPersonPhone",
    header: () => (
      <div className="flex flex-row items-center gap-x-2">
        <Phone className="h-4 w-4" />
        Contact Phone
      </div>
    ),
    cell: ({ row }) =>
      row.original.contactPersonPhone ? (
        <div className="flex items-center">
          {row.original.contactPersonPhone}
        </div>
      ) : (
        "N/A"
      ),
  },
  {
    accessorKey: "contactPersonPosition",
    header: "Contact Position",
  },
  {
    accessorKey: "activeStudents",
    header: "Active Students",
    cell: ({ row }) => row.original.activeStudents?.length || 0,
    enableSorting: false,
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    accessorKey: "pastStudents",
    header: "Past Students",
    cell: ({ row }) => row.original.pastStudents?.length || 0,
    enableSorting: false,
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    accessorKey: "studentRating",
    header: "Student Rating",
    cell: ({ row }) => renderRating(row.original.studentRating),
    enableSorting: false,
    meta: {
      headerClassName: "text-center justify-center",
      align: "center",
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
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
                Edit Company
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    meta: { export: false },
  },
];
