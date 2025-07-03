export const isValidRequiredUserName = (name: string): boolean => {
  if (!name || name.trim() === "") return false;
  return name.trim().length <= 32 && /^[a-zA-Z\s.-]+$/.test(name.trim());
};

export const isValidOptionalUserName = (name: string): boolean => {
  if (name?.trim() === "") return true;
  if (!name) return false;
  return name.trim().length <= 32 && /^[a-zA-Z\s.-]+$/.test(name.trim());
};
