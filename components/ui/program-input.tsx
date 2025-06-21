"use client";

import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgramInputProps {
  value: string[];
  onChange: (programs: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const ProgramInput: React.FC<ProgramInputProps> = ({
  value = [],
  onChange,
  placeholder = "Enter program and press Enter",
  className = "",
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const removeProgram = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 min-h-[48px] w-full px-4 py-2 border rounded-lg bg-white",
        value.length > 0 ? "border-green-600 border-opacity-50" : "border-gray-300",
        disabled ? "opacity-50 cursor-not-allowed" : "hover:border-gray-400 focus-within:border-gray-900",
        className
      )}
    >
      {value.map((program, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
        >
          <span className="truncate max-w-[120px]">{program}</span>
          {!disabled && (
            <button
              type="button"
              onClick={() => removeProgram(index)}
              className="hover:bg-blue-200 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={value.length === 0 ? placeholder : ""}
        disabled={disabled}
        className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-gray-900 placeholder-gray-500"
      />
    </div>
  );
};
