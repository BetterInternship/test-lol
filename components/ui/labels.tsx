/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 22:06:11
 * @ Modified time: 2025-06-24 21:36:02
 * @ Description:
 *
 * Commonly used label components
 * All of them must have the value prop
 */

import { CheckCircle, CircleX } from "lucide-react";
import React from "react";

const DEFAULT_LABEL = "Not specified";
type Value = string | null | undefined;
type LabelComponentProps = { value?: Value; fallback?: Value };
type LinkLabelComponentProps = {
  name?: Value;
  value?: Value;
  fallback?: Value;
};
export type LabelComponent = React.FC<LabelComponentProps>;

/**
 * Used in profile page
 *
 * @component
 */
export const UserPropertyLabel: LabelComponent = ({
  value,
  fallback,
}: LabelComponentProps) => {
  return (
    <p className="text-gray-500 font-medium text-sm">
      {value || (
        <span className="text-gray-400 italic">
          {fallback ?? DEFAULT_LABEL}
        </span>
      )}
    </p>
  );
};

/**
 * Displays links on profile page
 *
 * @component
 */
export const UserLinkLabel: LabelComponent = ({
  value,
}: LinkLabelComponentProps) => {
  return (
    <div>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm"
        >
          {"Link"}
        </a>
      ) : (
        <span className="text-gray-400 italic text-sm">{DEFAULT_LABEL}</span>
      )}
    </div>
  );
};

/**
 * Used in job details
 *
 * @component
 */
export const JobPropertyLabel: LabelComponent = ({
  value,
  fallback,
}: LabelComponentProps) => {
  return (
    <p className="text-gray-500 font-medium text-sm">
      {value || (
        <span className="text-gray-400 italic">
          {fallback ?? DEFAULT_LABEL}
        </span>
      )}
    </p>
  );
};

/**
 * Used in job details
 *
 * @component
 */
export const JobBooleanLabel: LabelComponent = ({
  value,
  fallback,
}: LabelComponentProps) => {
  return (
    <p className="text-gray-500 font-medium text-sm">
      {!["", "false", "null", "undefined"].includes(
        value?.toString().trim() ?? ""
      ) ? (
        <CheckCircle className="w-5 h-5 text-blue-500"></CheckCircle>
      ) : (
        <CircleX className="w-5 h-5 text-grey-500"></CircleX>
      )}
    </p>
  );
};

/**
 * Used in job details as titles
 *
 * @component
 */
export const JobTitleLabel: LabelComponent = ({
  value,
  fallback,
}: LabelComponentProps) => {
  return (
    <p className="text-gray-900 font-heading font-bold text-4xl">
      {value || (
        <span className="text-gray-400 italic">
          {fallback ?? DEFAULT_LABEL}
        </span>
      )}
    </p>
  );
};
