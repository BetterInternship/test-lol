export const getPercentage = (numerator?: number | null, denominator?: number | null) => {
  if (numerator === null || numerator === undefined) {
    return 0;
  }
  if (denominator === null || denominator === undefined) {
    return 0;
  }

  if (denominator === 0) {
    return 0;
  }
  return Math.round((numerator / denominator) * 100);
}