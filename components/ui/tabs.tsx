"use client";

import * as React from "react";
import { Children, useState, useEffect } from "react";
import { Button } from "./button";

/**
 * Represents a child of the TabGroup component.
 *
 * @component
 */
interface TabProps {
  name: string;
  children: React.ReactNode;
}
export const Tab = ({ name, children }: TabProps) => {
  return <>{children}</>;
};

/**
 * Acts as a context for tabs.
 *
 * @component
 */
interface TabGroupProps {
  children: React.ReactElement<TabProps>[];
}
export const TabGroup = ({ children }: TabGroupProps) => {
  const [active_tab, set_active_tab] = useState("");

  // Set the initial active tab to be the first element
  useEffect(() => {
    const first_child = Children.toArray(
      children
    )[0] as React.ReactElement<TabProps>;
    if (React.isValidElement(first_child))
      set_active_tab(first_child.props?.name ?? "");
  }, []);

  // Create the selection
  return (
    <>
      <div className="sticky top-0 flex flex-row items-start bg-white w-full h-fit pb-0 z-50 border-b-2 border-b-gray-900">
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            const name = child.props?.name ?? "No name";
            return (
              <Button
                variant="ghost"
                aria-selected={active_tab === name}
                className="px-5 py-4 text-gray-700 aria-selected:text-white aria-selected:bg-gray-900 w-fit rounded-t-[0.33em] rounded-b-none"
                onClick={() => set_active_tab(name)}
              >
                <span className="text-xs">{name}</span>
              </Button>
            );
          }
        })}
      </div>
      <div className="relative w-full h-full">
        {
          Children.toArray(children).filter((child) => {
            const c = child as React.ReactElement<TabProps>;
            if (React.isValidElement(c)) return c.props?.name === active_tab;
          })[0]
        }
      </div>
    </>
  );
};
