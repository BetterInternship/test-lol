/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-14 23:30:09
 * @ Modified time: 2025-06-15 02:59:36
 * @ Description:
 *
 * Stateful dropdown group component.
 */

import React, { useEffect, createContext, useContext, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Button } from "@/components/ui/button";

/**
 * The group context interface.
 * What's available in the group context to other components.
 */
interface IDropdownGroupContext {
  active_dropdown: string;
  set_active_dropdown: (dropdown: string) => void;
}
const DropdownGroupContext = createContext<IDropdownGroupContext>(
  {} as IDropdownGroupContext
);

/**
 * This component creates a context provider for dropdowns inside it to use.
 * The dropdowns inside can modify the active dropdown when they're clicked.
 * This way, only one dropdown in the group is active at a time.
 *
 * @component
 */
export const DropdownGroup = ({ children }: { children: React.ReactNode }) => {
  const [active_dropdown, set_active_dropdown] = useState("");
  const group_dropdown_context: IDropdownGroupContext = {
    active_dropdown,
    set_active_dropdown,
  };

  return (
    <DropdownGroupContext value={group_dropdown_context}>
      {children}
    </DropdownGroupContext>
  );
};

/**
 * This represents a single dropdown inside the group.
 * Inherits the provided context (if there is none, that's fine).
 *
 * @component
 */
export const GroupableRadioDropdown = ({
  name,
  options,
  on_change,
  default_value = options[0],
}: {
  name: string;
  options: string[];
  on_change: (option: (typeof options)[number]) => void;
  default_value?: (typeof options)[number];
}) => {
  const { active_dropdown, set_active_dropdown } =
    useContext(DropdownGroupContext);
  const [is_open, set_is_open] = useState(false);
  const [value, set_value] = useState(default_value);
  const ref = useDetectClickOutside({ onTriggered: () => set_is_open(false) });

  // ! to remove -> mobile
  const is_mobile = false;

  /**
   * Activates dropdown
   * @param e
   */
  const handle_click: React.MouseEventHandler = (e) => {
    set_is_open(!is_open);
    set_active_dropdown(name);
  };

  /**
   * Changes dropdown value
   * @param option
   */
  const handle_change = (option: (typeof options)[number]) => {
    set_value(option);
    on_change(option);
    set_is_open(false);
  };

  // Check if it's still the active dropdown
  useEffect(() => {
    if (active_dropdown !== name) set_is_open(false);
  }, [active_dropdown]);

  return (
    <div className="relative">
      <Button
        ref={ref}
        variant="ghost"
        onClick={handle_click}
        className={`${
          is_mobile
            ? "h-12 px-4 flex items-center gap-2 w-full justify-between text-left bg-white border-0 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium text-gray-700"
            : "h-auto py-2 px-2 flex items-center gap-1 justify-between bg-transparent border-0 hover:bg-transparent transition-all duration-200 font-normal text-gray-700 text-sm w-full"
        }`}
      >
        <span
          className={`${
            is_mobile ? "text-sm" : "text-sm"
          } whitespace-nowrap truncate`}
        >
          {value}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform flex-shrink-0 text-gray-400 ml-1 ${
            is_open ? "rotate-180" : ""
          }`}
        />
      </Button>

      {is_open && (
        <div
          className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl z-50 min-w-[200px] overflow-hidden border border-gray-100`}
        >
          {options.map((option, index) => (
            <button
              key={option}
              onClick={(e) => handle_change(option)}
              className={`w-full text-left px-4 ${
                is_mobile ? "py-3 text-sm font-medium" : "py-2 text-sm"
              } hover:bg-gray-50 transition-colors duration-150 ${
                index === 0 ? "" : ""
              } ${
                index === options.length - 1 ? "" : ""
              } text-gray-700 whitespace-nowrap ${
                value === option ? "bg-gray-50 text-gray-900 font-medium" : ""
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
