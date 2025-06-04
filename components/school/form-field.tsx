import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  icon?: React.ElementType;
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  icon: Icon,
  htmlFor,
  required,
  className,
  children,
  error,
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {Icon && (
          <Icon className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
        )}
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
