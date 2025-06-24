/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-17 21:37:03
 * @ Modified time: 2025-06-21 17:05:01
 * @ Description:
 *
 * Editable utils for forms and stuff
 */

import { Input } from "./input";
import React from "react";
import { GroupableRadioDropdown } from "./dropdown";
import { Checkbox } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import DatePicker from "react-datepicker";

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
      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm relative z-10 pointer-events-auto"
      style={{ position: 'relative', zIndex: 10 }}
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
      default_value={value as string}
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

export const EditableCheckbox = ({
  is_editing,
  value,
  setter,
  children,
}: {
  is_editing: boolean;
  value: boolean | null | undefined;
  setter: (value: string) => void;
  children?: React.ReactElement<{ value?: Value }>;
}) => {
  return is_editing ? (
    <div className="relative flex items-center space-x-2">
      <Checkbox
        checked={value ?? false}
        className={cn(
          "flex flex-row items-center justify-center border rounded-full w-5 h-5",
          value
            ? "border-blue-500 border-opacity-85 bg-blue-200"
            : "border-gray-300 bg-gray-50"
        )}
        // @ts-ignore
        onCheckedChange={(value) => setter(value)}
      >
        {value && <Check className="absolute w-3 h-3 text-blue-600"></Check>}
      </Checkbox>
    </div>
  ) : (
    <p className="text-gray-900 font-medium text-sm">
      {
        <span className="inline-flex items-center gap-2 text-green-700">
          {
            (React.Children.map(children, (child) => {
              if (React.isValidElement(child))
                return React.cloneElement(child, { value: value?.toString() });
              return <></>;
            }) ?? [<></>])[0]
          }
        </span>
      }
    </p>
  );
};

export const EditableDatePicker = ({
  is_editing,
  value,
  setter,
  children,
}: {
  is_editing: boolean;
  value: Date | null | undefined;
  setter: (value: number | null | undefined) => void;
  children?: React.ReactElement<{ value?: Value }>;
}) => {
  return is_editing ? (
    <div className="relative flex items-center space-x-2">
      <DatePicker
        id=""
        selected={value ? new Date(value) : new Date()}
        className="input-box"
        onChange={(date) => setter(date?.getTime())}
      ></DatePicker>
    </div>
  ) : (
    <p className="text-gray-900 font-medium text-sm">
      {
        <span className="inline-flex items-center gap-2 text-green-700">
          {
            (React.Children.map(children, (child) => {
              if (React.isValidElement(child))
                return React.cloneElement(child, {
                  value: value?.toLocaleDateString() ?? "",
                });
              return <></>;
            }) ?? [<></>])[0]
          }
        </span>
      }
    </p>
  );
};
