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
  if (!urlObj.hostname || urlObj.hostname.indexOf(".") < 0) return false;
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
 * A utility function to create regex-based link checkers.
 *
 * @param regex
 * @returns
 */
const isValidOptionalSiteURL = (regex: RegExp) => (url: string) => {
  if (!url || url.trim() === "") return true;
  if (!isValidOptionalURL(url)) return false;
  const urlObj = toURL(url);
  if (!urlObj) return false;
  return regex.test(urlObj.href);
};

// Valid OPTIONAL site URL checkers with regex patterns.
export const isValidOptionalGitHubURL = isValidOptionalSiteURL(
  /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9]([a-zA-Z0-9\-_]*[a-zA-Z0-9])?$/
);

export const isValidOptionalLinkedinURL = isValidOptionalSiteURL(
  /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/
);

export const isValidOptionalCalendarURL = isValidOptionalSiteURL(
  /^https?:\/\/(calendar\.google\.com\/calendar\/u\/\d+\/appointments(\/schedules)?\/[a-zA-Z0-9\-_=]+|calendar\.app\.google\/[a-zA-Z0-9]+)\/?$/
);

/**
 * Opens a URL in a new tab.
 *
 * @param url
 */
export const openURL = (url: string | null | undefined) => {
  if (!url) return;
  window?.open(url ?? "", "_blank")?.focus();
};
