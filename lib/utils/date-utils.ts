/**
 * Date formatter.
 *
 * @param dateString
 * @returns
 */
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

/**
 * Time ago formatter
 *
 * @param fromDateString
 * @returns
 */
export const formatTimeAgo = (fromDateString: string) => {
  const from = new Date(fromDateString).getTime();
  const to = new Date().getTime();

  const seconds = Math.floor((to - from) / 1000);

  const intervals = [
    { label: "y", seconds: 31536000 }, // 365 * 24 * 60 * 60
    { label: "mo", seconds: 2592000 }, // 30 * 24 * 60 * 60
    { label: "w", seconds: 604800 }, // 7 * 24 * 60 * 60
    { label: "d", seconds: 86400 }, // 24 * 60 * 60
    { label: "h", seconds: 3600 }, // 60 * 60
    { label: "min", seconds: 60 },
    { label: "s", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }

  return "just now";
};
