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
  const { ref_is_not_null } = useRefs();
  if (!user) return false;
  if (
    !user.calendar_link ||
    !ref_is_not_null(user.college) ||
    !ref_is_not_null(user.degree) ||
    !ref_is_not_null(user.department) ||
    !user.email ||
    !user.first_name ||
    !user.last_name ||
    !user.phone_number ||
    !user.profile_picture ||
    !user.resume ||
    !ref_is_not_null(user.university) ||
    !ref_is_not_null(user.year_level)
  )
    return false;
  return true;
};
