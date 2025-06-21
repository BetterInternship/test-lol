"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { useDetectClickOutside } from "react-detect-click-outside";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  maxDisplayItems?: number;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  placeholder = "Select options...",
  className = "",
  maxDisplayItems = 2,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useDetectClickOutside({ onTriggered: () => setIsOpen(false) });

  const handleToggleOption = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange?.(newValue);
  };

  const handleRemoveOption = (option: string) => {
    const newValue = value.filter((item) => item !== option);
    onChange?.(newValue);
  };

  const displayText = () => {
    if (value.length === 0) return placeholder;
    if (value.length <= maxDisplayItems) {
      return value.join(", ");
    }
    return `${value.slice(0, maxDisplayItems).join(", ")} +${value.length - maxDisplayItems} more`;
  };

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full h-12 px-4 input-box hover:cursor-pointer focus:ring-0",
          value.length > 0 ? "border-green-600 border-opacity-50" : "border-gray-300"
        )}
      >
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          {value.length > 0 && value.length <= maxDisplayItems ? (
            <div className="flex flex-wrap gap-1 flex-1">
              {value.map((option) => (
                <span
                  key={option}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md"
                >
                  <span className="truncate max-w-[120px]">{option}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveOption(option);
                    }}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <span
              className={cn(
                "truncate text-left",
                value.length === 0 ? "text-gray-500" : "text-gray-900"
              )}
            >
              {displayText()}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-600 transition-transform flex-shrink-0",
            isOpen ? "rotate-180" : ""
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 bg-white rounded-md shadow-xl min-w-full z-50 overflow-hidden border border-gray-100 max-h-60 overflow-y-auto">
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleToggleOption(option)}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
