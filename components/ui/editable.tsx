/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 21:37:03
 * @ Modified time: 2025-06-17 22:44:51
 * @ Description:
 *
 * Editable utils for forms and stuff
 */

import { Input } from "./input";
import React from "react";
import { GroupableRadioDropdown } from "./dropdown";

type Value = string | null | undefined;

/**
 * A text display that can be toggled to become editable.
 *
 * @component
 */
export const EditableInput = ({
  is_editing,
  value,
  setter,
  placeholder,
  children,
}: {
  is_editing: boolean;
  value: Value;
  setter: (value: string) => void;
  placeholder?: string;
  children?: React.ReactElement<{ value?: Value }>;
}) => {
  return is_editing ? (
    <Input
      value={value ?? ""}
      onChange={(e) => setter(e.target.value)}
      placeholder={placeholder}
      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
    />
  ) : (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child))
        return React.cloneElement(child, { value });
      return <></>;
    })
  );
};

/**
 * A dropdown display that can be toggle to become editable.
 *
 * @component
 */
export const EditableGroupableRadioDropdown = ({
  is_editing,
  name,
  value,
  setter,
  options = [],
  children,
}: {
  is_editing: boolean;
  name: string;
  value: Value;
  setter: (value: string) => void;
  options: string[];
  children?: React.ReactElement<{ value?: Value }>;
}) => {
  return is_editing ? (
    <GroupableRadioDropdown
      name={name}
      options={options}
      on_change={setter}
    ></GroupableRadioDropdown>
  ) : (
    React.Children.map(children, (child) => {
      if (React.isValidElement(child))
        return React.cloneElement(child, { value });
      return <></>;
    })
  );
};
