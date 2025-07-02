import { useFormData, IFormData } from "@/lib/form-data";
import { createContext, JSX, useContext } from "react";

interface EditFormContext<T extends IFormData> {
  formData: T;
  setField: (k: string, v: any) => void;
  setFields: (p: Partial<T>) => void;
  fieldSetter: (k: string) => (v: any) => void;
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

    return (
      <EditFormContext.Provider
        value={{
          formData,
          setField,
          setFields,
          fieldSetter,
        }}
      >
        {children}
      </EditFormContext.Provider>
    );
  };

  return [EditForm, useEditForm];
};
