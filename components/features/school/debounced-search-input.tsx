"use client";

import React, { useState, useEffect } from "react";
import { Input, InputProps } from "@/components/features/school/ui/input";
import { cn } from "@/lib/utils";

interface DebouncedSearchInputProps
  extends Omit<InputProps, "value" | "onChange"> {
  parentDebouncedTerm: string;
  onDebouncedChange: (term: string) => void;
  debounceTimeout?: number;
}

const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  parentDebouncedTerm,
  onDebouncedChange,
  debounceTimeout = 300,
  placeholder,
  className,
  ...restInputProps
}) => {
  const [inputValue, setInputValue] = useState(parentDebouncedTerm);

  useEffect(() => {
    if (inputValue !== parentDebouncedTerm) {
      setInputValue(parentDebouncedTerm);
    }
  }, [parentDebouncedTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== parentDebouncedTerm) {
        onDebouncedChange(inputValue);
      }
    }, debounceTimeout);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, parentDebouncedTerm, onDebouncedChange, debounceTimeout]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setInputValue("");
    onDebouncedChange("");
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className={cn("w-full", "pr-10")}
        {...restInputProps}
      />
      {inputValue && (
        <button
          type="button"
          onClick={clearInput}
          className="absolute inset-y-0 right-0 flex items-center pr-2"
        >
          x
        </button>
      )}
    </div>
  );
};

export default DebouncedSearchInput;
