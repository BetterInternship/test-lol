/**
 * Checks if the number is a valid PH phone number.
 * Counts empty strings.
 *
 * @param phone
 * @returns
 */
export const isValidOptionalPhoneNumber = (phone: string): boolean => {
  if (!phone || phone.trim() === "") return true;
  const cleanPhone = phone.replace(/\D/g, "");
  return cleanPhone.length === 11 && /^09\d{9}$/.test(cleanPhone);
};
