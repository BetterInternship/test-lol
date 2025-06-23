import { PrivateUser, PublicUser } from "../db/db.types";

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
export const user_can_apply = (user: PrivateUser): boolean => {
  return false;
};
