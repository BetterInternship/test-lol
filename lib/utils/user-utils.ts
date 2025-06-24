import { PublicUser } from "../db/db.types";
import { useRefs } from "../db/use-refs";

/**
 * A utility that gets the full name of the user.
 * Does not include the middle name.
 *
 * @param user
 * @returns
 */
export const get_full_name = (
  user: Partial<PublicUser> | null | undefined
): string => {
  let name = "";
  if (!user) return name;
  if (!user.first_name && !user.last_name) return name;
  if (!user.first_name && user.last_name) name = user.last_name;
  if (user.first_name && !user.last_name) name = user.first_name;
  if (user.first_name && user.last_name)
    name = `${user.first_name ?? ""} ${user.last_name ?? ""}`;
  return name.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
};

/**
 * Gets a detailed breakdown of missing profile fields for application.
 * Returns an object with missing fields and user-friendly labels.
 */
export const get_missing_profile_fields = (user: PublicUser | null): {
  missing: string[];
  labels: Record<string, string>;
  canApply: boolean;
} => {
  const fieldLabels: Record<string, string> = {
    calendar_link: "Calendar Link",
    college: "College",
    degree: "Degree Program",
    department: "Department",
    email: "Email Address",
    first_name: "First Name",
    last_name: "Last Name",
    phone_number: "Phone Number",
    resume: "Resume",
    university: "University",
    year_level: "Year Level"
  };

  const not_null = (ref: any) => ref || ref === 0;
  const missing: string[] = [];

  if (!user) {
    return {
      missing: Object.keys(fieldLabels),
      labels: fieldLabels,
      canApply: false
    };
  }

  // Check each required field
  const requiredFields = [
    'calendar_link', 'college', 'degree', 'department', 'email',
    'first_name', 'last_name', 'phone_number', 'resume', 'university', 'year_level'
  ] as const;

  requiredFields.forEach(field => {
    if (!not_null(user[field])) {
      missing.push(field);
    }
  });

  return {
    missing,
    labels: fieldLabels,
    canApply: missing.length === 0
  };
};

/**
 * Checks whether all the needed fields from the user have been filled for applying.
 * 
 */
export const user_can_apply = (user: PublicUser | null): boolean => {
  return get_missing_profile_fields(user).canApply;
};
