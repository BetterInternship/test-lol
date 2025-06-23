/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-14 23:30:09
 * @ Modified time: 2025-06-20 15:06:57
 * @ Description:
 *
 * Stateful dropdown group component.
 */

import React, { useEffect, createContext, useContext, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/lib/ctx-app";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
 * A wrapper around the contents of a dropdown option.
 *
 * @component
 */
type IDropdownOptionProps = {
  children?: React.ReactNode;
  highlighted?: boolean;
  disabled?: boolean;
  href?: string;
  on_click?: () => void;
};
export const DropdownOption = ({ children }: IDropdownOptionProps) => {
  return <>{children}</>;
};

/**
 * Creates a standard button dropdowns must use.
 * Not meant to be used elsewhere.
 *
 * @component
 */
const DropdownOptionButton = ({
  children,
  set_is_open,
}: {
  children: React.ReactElement<IDropdownOptionProps>;
  set_is_open: (is_open: boolean) => void;
}) => {
  const router = useRouter();

  return (
    <button
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
      onClick={(e) => {
        e.stopPropagation();
        set_is_open(false);
        children.props.on_click && children.props.on_click();
        children.props.href && router.push(children.props.href);
      }}
    >
      <div
        className={cn(
          "w-full",
          children.props.highlighted ? "text-blue-500" : ""
        )}
      >
        {children}
      </div>
    </button>
  );
};

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
  button_class = "",
  className = "",
}: {
  name: string;
  options: string[];
  on_change: (option: string) => void;
  default_value?: string;
  button_class?: string;
  className?: string;
}) => {
  const ref = useDetectClickOutside({ onTriggered: () => set_is_open(false) });
  const { is_mobile } = useAppContext();
  const { active_dropdown, set_active_dropdown } =
    useContext(DropdownGroupContext);
  const [is_open, set_is_open] = useState(false);
  const [value, set_value] = useState(default_value);

  // Just so it's not stuck at the first default when the default changes
  useEffect(() => {
    set_value(default_value);
  }, [default_value]);

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
    <div className={cn("relative", className)}>
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          handle_click(e);
        }}
        className={cn(
          "flex items-center input-box justify-between",
          is_mobile
            ? "h-12 px-4 gap-2 w-full text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 font-medium"
            : "h-auto py-3 px-3 gap-1 bg-transparent font-normal text-sm w-full",
          button_class
        )}
      >
        <span
          className={cn(
            "whitespace-nowrap truncate",
            is_mobile ? "text-sm" : "text-sm"
          )}
        >
          {value}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-600 transition-transform",
            is_open ? "rotate-180" : ""
          )}
        />
      </Button>

      {is_open && (
        <div
          className={cn(
            "absolute top-full mt-2 bg-white rounded-md shadow-xl z-50 overflow-hidden border border-gray-100",
            is_mobile ? "min-w-full" : "min-w-[200px]",
            className
          )}
        >
          {options.map((option, index) => (
            <DropdownOptionButton key={index} set_is_open={set_is_open}>
              <DropdownOption
                highlighted={value === option}
                on_click={() => handle_change(option)}
              >
                {option}
              </DropdownOption>
            </DropdownOptionButton>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * This creates a dropdown menu for navigating.
 *
 * @component
 */
export const GroupableNavDropdown = ({
  display,
  content,
  children,
  className = "",
  showArrow = true,
}: {
  display?: React.ReactNode;
  content?: React.ReactNode;
  children?:
    | React.ReactElement<IDropdownOptionProps>
    | React.ReactElement<IDropdownOptionProps>[];
  className?: string;
  showArrow?: boolean;
}) => {
  const ref = useDetectClickOutside({ onTriggered: () => set_is_open(false) });
  const [is_open, set_is_open] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <Button
        ref={ref}
        type="button"
        variant="outline"
        className="flex items-center gap-2 h-10 px-4 bg-white border-gray-300 hover:bg-gray-50"
        onClick={() => set_is_open(!is_open)}
      >
        {display}
        {/* Conditionally render the chevron arrow */}
        {showArrow && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-gray-600 transition-transform",
              is_open ? "rotate-180" : ""
            )}
          />
        )}
      </Button>

      {is_open && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50",
            className
          )}
        >
          <div className="py-1">
            {content}

            {React.Children.map(children, (child, index) => {
              return (
                <DropdownOptionButton key={index} set_is_open={set_is_open}>
                  {child ? child : <></>}
                </DropdownOptionButton>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
