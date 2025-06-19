/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 22:06:11
 * @ Modified time: 2025-06-19 07:06:55
 * @ Description:
 *
 * Commonly used label components
 * All of them must have the value prop
 */

import React from "react";

const DEFAULT_LABEL = "Not specified";
type Value = string | null | undefined;
type LabelComponentProps = { value?: Value };
export type LabelComponent = React.FC<{ value?: Value }>;

/**
 * Used in profile page
 *
 * @component
 */
export const UserPropertyLabel: LabelComponent = ({
  value,
}: LabelComponentProps) => {
  return (
    <p className="text-gray-500 font-medium text-sm">
      {value || <span className="text-gray-400 italic">{DEFAULT_LABEL}</span>}
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
}: LabelComponentProps) => {
  return (
    <div>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline text-sm"
        >
          {value}
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
}: LabelComponentProps) => {
  return (
    <p className="text-gray-500 font-medium text-sm">
      {value || <span className="text-gray-400 italic">{DEFAULT_LABEL}</span>}
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
}: LabelComponentProps) => {
  return (
    <p className="text-gray-900 font-heading font-bold text-4xl">
      {value || <span className="text-gray-400 italic">{DEFAULT_LABEL}</span>}
    </p>
  );
};
