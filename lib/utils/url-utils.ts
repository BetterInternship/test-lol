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
 * Checks if the URL is a valid company website.
 * Must have a proper domain structure and exclude certain invalid patterns.
 * 
 * Validation rules:
 * - Must be a valid URL with http/https protocol
 * - Must have a proper domain name with at least one dot
 * - Excludes localhost, IP addresses, and development domains (.local, .dev, .test)
 * - Must have a valid TLD (top-level domain) of at least 2 characters
 * - Domain parts must contain only valid characters (alphanumeric and hyphens)
 * 
 * Examples:
 * - ✅ Valid: "https://example.com", "http://company.co.uk", "mycompany.org"
 * - ❌ Invalid: "localhost:3000", "192.168.1.1", "test.local", "invalid", ""
 *
 * @param url - The URL string to validate
 * @returns true if the URL is a valid company website, false otherwise
 */
export const isValidCompanyWebsite = (url: string): boolean => {
  if (!url || url.trim() === "") return false;
  
  const urlObj = toURL(url);
  if (!urlObj) return false;
  
  // Must be http or https
  if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") return false;
  
  // Must have a valid hostname with at least one dot
  if (!urlObj.hostname || urlObj.hostname.indexOf(".") < 0) return false;
  
  // Exclude localhost, IP addresses, and development domains
  const hostname = urlObj.hostname.toLowerCase();
  
  // Exclude localhost variations
  if (hostname === "localhost" || hostname.startsWith("localhost.")) return false;
  
  // Exclude IP addresses (basic check)
  if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return false;
  
  // Exclude common development domains
  const devDomains = [".local", ".dev", ".test", ".localhost"];
  if (devDomains.some(domain => hostname.endsWith(domain))) return false;
  
  // Must have a valid TLD (at least 2 characters after the last dot)
  const parts = hostname.split(".");
  if (parts.length < 2) return false;
  const tld = parts[parts.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) return false;
  
  // Domain name parts should only contain valid characters
  const domainPattern = /^[a-zA-Z0-9]([a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!domainPattern.test(parts[i])) return false;
  }
  
  return true;
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
