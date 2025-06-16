import { DateTime } from "luxon";
import { AcademicYear } from "@/types";

export function dateWithinRange(
  date: string | undefined | null,
  range: "7days" | "14days" | "30days" | "90days" | "1year"
) {
  if (!date) return false;
  const parsedDate = DateTime.fromISO(date).setZone("Asia/Manila");
  const now = DateTime.now().setZone("Asia/Manila");
  const diff = now.diff(parsedDate, ["days"]);
  const days = diff.days;
  switch (range) {
    case "7days":
      return days <= 7;
    case "14days":
      return days <= 14;
    case "30days":
      return days <= 30;
    case "90days":
      return days <= 90;
    case "1year":
      return days <= 365;
    default:
      return false;
  }
}

export function validateDate(
  date: string | undefined | null | Date | number
): boolean {
  if (!date) return false;
  if (typeof date === "number") {
    const parsedDate = DateTime.fromMillis(date).setZone("Asia/Manila");
    return parsedDate.isValid;
  }
  //if it already a date, transform to luxon date
  if (date instanceof Date) {
    const parsedDate = DateTime.fromJSDate(date).setZone("Asia/Manila");
    return parsedDate.isValid;
  }
  const parsedDate = DateTime.fromISO(date).setZone("Asia/Manila");
  return parsedDate.isValid;
}
function fixDate(date: string | Date | number): string {
  if (typeof date === "number") {
    return new Date(date).toISOString();
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  const dateParts = date.split(" ");
  if (dateParts.length === 2) {
    return `${dateParts[0]}T${dateParts[1]}`;
  }
  return date;
}

export function formatTimeAgo(date: string | undefined | null): string {
  if (!date) return "N/A";
  let newDate = date;
  if (!validateDate(date)) {
    newDate = fixDate(date);
  }
  const now = DateTime.now().setZone("Asia/Manila");
  const diff = now.diff(DateTime.fromISO(newDate).setZone("Asia/Manila"), [
    "seconds",
    "minutes",
    "hours",
    "days",
    "months",
    "years",
  ]);

  if (diff.seconds <= 60 && diff.minutes < 1) {
    return "a few seconds ago";
  }

  if (diff.minutes <= 60 && diff.hours < 1) {
    return `${Math.round(diff.minutes)} minute${
      Math.round(diff.minutes) !== 1 ? "s" : ""
    } ago`;
  }

  if (diff.hours <= 24 && diff.days < 1) {
    return `${Math.round(diff.hours)} hour${
      Math.round(diff.hours) !== 1 ? "s" : ""
    } ago`;
  }

  if (diff.days <= 30 && diff.months < 1) {
    return `${Math.round(diff.days)} day${
      Math.round(diff.days) !== 1 ? "s" : ""
    } ago`;
  }

  if (diff.months <= 12 && diff.years < 1) {
    return `${Math.ceil(diff.months)} month${
      Math.ceil(diff.months) !== 1 ? "s" : ""
    } ago`;
  }

  return `${Math.ceil(diff.years)} year${
    Math.ceil(diff.years) !== 1 ? "s" : ""
  } ago`;
}

export function parseDate(
  date: string | null | undefined | Date,
  format?: string
): string {
  if (!date) return "N/A";
  let newDate = date;
  if (!validateDate(date)) {
    newDate = fixDate(date);
  }

  if (typeof newDate === "string") {
    const parsedDate = DateTime.fromISO(newDate).setZone("Asia/Manila");
    return parsedDate.toFormat(format || "MMMM dd, yyyy");
  } else {
    {
      const parsedDate = DateTime.fromJSDate(newDate).setZone("Asia/Manila");
      return parsedDate.toFormat(format || "MMMM dd, yyyy");
    }
  }
}

export function isDateSame(
  date1: string | Date | number | null | undefined,
  date2: string | Date | number | null | undefined
) {
  if (!date1 || !date2) return false;
  let newDate1 = date1;
  let newDate2 = date2;

  if (!validateDate(date1)) {
    newDate1 = fixDate(date1);
  }
  if (!validateDate(date2)) {
    newDate2 = fixDate(date2);
  }

  const parsedDate1 = DateTime.fromISO(newDate1.toString()).setZone(
    "Asia/Manila"
  );
  const parsedDate2 = DateTime.fromISO(newDate2.toString()).setZone(
    "Asia/Manila"
  );

  return parsedDate1.hasSame(parsedDate2, "day");
}

export const checkAcademicYearMatch = (
  itemDateStr: string | undefined,
  academicYearFilter: AcademicYear | "all" | undefined
): boolean => {
  if (academicYearFilter === "all" || !academicYearFilter) {
    return true;
  }
  if (!itemDateStr) {
    return false;
  }

  try {
    const itemDate = DateTime.fromISO(itemDateStr);
    if (!itemDate.isValid) {
      return false;
    }

    const [startYearStr, endYearStr] = academicYearFilter.split("-");
    const startAcademicYear = parseInt(startYearStr, 10);
    const endAcademicYear = parseInt(endYearStr, 10);

    if (isNaN(startAcademicYear) || isNaN(endAcademicYear)) {
      return false;
    }

    const academicYearStartDate = DateTime.local(
      startAcademicYear,
      6,
      1
    ).startOf("day");
    const academicYearEndDate = DateTime.local(endAcademicYear, 5, 31).endOf(
      "day"
    );

    return itemDate >= academicYearStartDate && itemDate <= academicYearEndDate;
  } catch (e) {
    return false;
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return (
    date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) +
    ", " +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0")
  );
};
