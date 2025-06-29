"use client";

import * as React from "react";
import { Children, useState, useEffect } from "react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export const TabGroup = ({
  layout = "landscape",
  children,
}: {
  layout?: "landscape" | "portrait";
  children: React.ReactNode;
}) => {
  const [active_tab, set_active_tab] = useState("");

  useEffect(() => {
    const first_child = Children.toArray(children)[0];
    if (React.isValidElement(first_child))
      // @ts-ignore
      set_active_tab(first_child.props?.name);
  }, []);

  // Create the selection
  return (
    <div
      className={cn(
        "relative w-full h-full flex",
        layout === "landscape" ? "flex-col" : "flex-row"
      )}
    >
      <div
        className={cn(
          "relative flex items-start bg-white p-4 px-2",
          layout === "landscape"
            ? "flex-row w-full h-fit pb-0"
            : "flex-col w-fit h-full space-y-1"
        )}
      >
        {Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // @ts-ignore
            const name = child.props?.name ?? "No name";
            return (
              <Button
                variant="ghost"
                aria-selected={active_tab === name}
                className={cn(
                  "p-6 text-left hover:bg-gray-200 hover:text-blue-600 text-gray-700 ring-0 focus:shadow-none focus:ring-transparent focus:ring-0 focus:outline-0 focus:border-0 aria-selected:text-white aria-selected:bg-blue-600",
                  layout === "landscape"
                    ? "w-fit rounded-t-sm rounded-b-none"
                    : "w-full"
                )}
                onClick={() => set_active_tab(name)}
              >
                <span className="text-lg">{name}</span>
              </Button>
            );
          }
          return <></>;
        })}
      </div>

      {/* Render just the first active child */}
      <div className="relative w-full h-full">
        {
          Children.toArray(children).filter((child) => {
            if (React.isValidElement(child))
              // @ts-ignore
              return child.props?.name === active_tab;
          })[0]
        }
      </div>
    </div>
  );
};

export const Tab = ({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) => {
  return <>{children}</>;
};
