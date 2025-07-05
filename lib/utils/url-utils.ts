/**
 * Allows accepting URLs that don't start with their respective protocols.
 * Returns null for invalid urls.
 *
 * @param url
 * @returns
 */
export const toURL = (url?: string | null): URL | null =>
  !url
    ? null
    : !url.toLowerCase().startsWith("http://") &&
      !url.toLowerCase().startsWith("https://")
    ? new URL("https://" + url)
    : new URL(url);

/**
 * Checks if the URL is valid.
 * Empty strings are NOT valid.
 *
 * @param url
 * @returns
 */
export const isValidRequiredURL = (url: string): boolean => {
  const urlObj = toURL(url);
  if (!urlObj) return false;
  return urlObj.protocol === "http:" || urlObj.protocol === "https:";
};

/**
 * Checks if the URL is valid.
 * Returns true for empty strings because it's optional.
 *
 * @param url
 * @returns
 */
export const isValidOptionalURL = (url: string): boolean => {
  if (!url || url.trim() === "") return true;
  const urlObj = toURL(url);

  if (!urlObj) return false;
  return urlObj.protocol === "http:" || urlObj.protocol === "https:";
};

/**
 * A utility function we use to create link checkers.
 *
 * @param hostnames
 * @returns
 */
const isValidOptionalSiteURL = (hostnames: string[]) => (url: string) => {
  if (!isValidOptionalURL(url)) return false;
  const urlObj = toURL(url);
  return url.trim() === "" || hostnames.includes(urlObj?.hostname ?? "");
};

// Valid OPTIONAL site URL checkers.
export const isValidOptionalGitHubURL = isValidOptionalSiteURL([
  "github.com",
  "www.github.com",
]);
export const isValidOptionalLinkedinURL = isValidOptionalSiteURL([
  "linkedin.com",
  "www.linkedin.com",
]);
export const isValidOptionalCalendarURL = isValidOptionalSiteURL([
  "calendar.app.google/",
  "calendar.google.com/calendar/u/0/appointments",
]);

/**
 * Opens a URL in a new tab.
 *
 * @param url
 */
export const openURL = (url: string | null | undefined) => {
  if (!url) return;
  window?.open(url ?? "", "_blank")?.focus();
};
