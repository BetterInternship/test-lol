import {
  useFormData,
  IFormData,
  IFormErrors,
  useFormErrors,
} from "@/lib/form-data";
import { createContext, JSX, useContext } from "react";
import { Input } from "./ui/input";
import { GroupableRadioDropdown } from "./ui/dropdown";
import { Checkbox } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface EditFormContext<T extends IFormData> {
  formData: T;
  formErrors: IFormErrors<T>;
  setField: (k: keyof T, v: any) => void;
  setFields: (p: Partial<T>) => void;
  fieldSetter: (k: keyof T) => (v: any) => void;
  addValidator: (k: keyof T, c: (v: any) => string | false) => void;
  hasErrors: () => boolean;
}

/**
 * Creates an edit form context and provider.
 *
 * @returns
 */
export const createEditForm = <T extends IFormData>(): [
  React.ComponentType<{
    data: Partial<T>;
    children: React.ReactNode;
  }>,
  () => EditFormContext<T>
] => {
  // Provides us with funcs to manipulate form
  const EditFormContext = createContext<EditFormContext<T>>(
    {} as EditFormContext<T>
  );

  // The use hook
  const useEditForm = () => useContext(EditFormContext);

  // Create the component
  const EditForm = ({
    data,
    children,
  }: {
    data: Partial<T>;
    children: React.ReactNode;
  }) => {
    const { formData, setField, setFields, fieldSetter } = useFormData<T>(data);
    const { formErrors, setError } = useFormErrors<T>();

    // Validates a field; callback returns false when nothing is wrong.
    const addValidator = (
      field: keyof T,
      hasError: (value: any) => string | false
    ) => {
      const error = hasError(formData[field]);
      if (typeof error === "boolean") return;
      else setError(field, error);
    };

    // Checks if any errors exist
    const hasErrors = () => {
      for (const k in formErrors) if (formErrors[k].trim()) return true;
      return false;
    };

    return (
      <EditFormContext.Provider
        value={{
          formData,
          formErrors,
          setField,
          setFields,
          fieldSetter,
          addValidator,
          hasErrors,
        }}
      >
        {children}
      </EditFormContext.Provider>
    );
  };

  return [EditForm, useEditForm];
};

/**
 * A utility to create form input fields easily.
 *
 * @component
 */
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  setter?: (value: any) => void;
  className?: string;
}

export const FormInput = ({
  label,
  value,
  setter,
  className,
  ...props
}: FormInputProps) => {
  return (
    <div>
      {label && (
        <label className="text-xs text-gray-400 italic mb-1 block">
          {label}
        </label>
      )}
      <Input
        value={value ?? ""}
        onChange={(e) => setter && setter(e.target.value)}
        className={className}
        {...props}
      />
    </div>
  );
};

/**
 * A utility to create form dropdown fields easily.
 *
 * @component
 */
interface FormDropdownProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  options: { id: number | string; name: string }[];
  label?: string;
  setter?: (value: any) => void;
  className?: string;
}

export const FormDropdown = ({
  label,
  value,
  options,
  setter,
  className,
  ...props
}: FormDropdownProps) => {
  return (
    <div>
      {label && (
        <label className="text-xs text-gray-400 italic mb-1 block">
          {label}
        </label>
      )}
      <GroupableRadioDropdown
        name={label ?? ""}
        // @ts-ignore
        defaultValue={value}
        options={options}
        onChange={(id) => setter && setter(id)}
      />
    </div>
  );
};

/**
 * A utility to create form dropdown fields easily.
 *
 * @component
 */
interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  label?: string;
  setter?: (value: any) => void;
  className?: string;
}

export const FormCheckbox = ({
  label,
  checked,
  setter,
  className,
  ...props
}: FormCheckboxProps) => {
  return (
    <div>
      {label && (
        <label className="text-xs text-gray-400 italic mb-1 block">
          {label}
        </label>
      )}
      <Checkbox
        name={label ?? ""}
        checked={checked}
        className={cn(
          "flex flex-row items-center justify-center border rounded-[0.2em] w-5 h-5",
          checked
            ? "border-primary border-opacity-85 bg-blue-200"
            : "border-gray-300 bg-gray-50"
        )}
        onCheckedChange={(checked) => setter && setter(checked)}
      >
        {checked && <Check className="text-primary opacity-75" />}
      </Checkbox>
    </div>
  );
};
