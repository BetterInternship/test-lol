"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/features/school/ui/select";
import { AcademicYear } from "@/types";

interface AcademicYearPickerProps {
  value?: AcademicYear | "all";
  onChange: (value: AcademicYear | "all") => void;
  years: readonly AcademicYear[];
  className?: string;
}

export const AcademicYearPicker: React.FC<AcademicYearPickerProps> = ({
  value,
  onChange,
  years,
  className,
}) => {
  return (
    <Select
      value={value || "all"}
      onValueChange={(val) => onChange(val as AcademicYear | "all")}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select Academic Year" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Academic Years</SelectItem>
        {years.map((year) => (
          <SelectItem key={year} value={year}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
