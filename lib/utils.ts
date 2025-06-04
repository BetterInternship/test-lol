export * from "./utils/string-utils";
export * from "./utils/date-utils";
export * from "./utils/num-utils";
export * from "./utils/constants";
export * from "./utils/file-utils";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
