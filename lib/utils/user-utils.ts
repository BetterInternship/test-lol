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
 * Checks whether all the needed fields from the user have been filled for applying.
 *
 */
export const user_can_apply = (user: PublicUser | null): boolean => {
  const not_null = (ref: any) => ref || ref === 0;
  if (!user) return false;
  if (
    !not_null(user.calendar_link) ||
    !not_null(user.college) ||
    !not_null(user.degree) ||
    !not_null(user.department) ||
    !not_null(user.email) ||
    !not_null(user.first_name) ||
    !not_null(user.last_name) ||
    !not_null(user.phone_number) ||
    !not_null(user.resume) ||
    !not_null(user.university) ||
    !not_null(user.year_level)
  )
    return false;
  return true;
};
