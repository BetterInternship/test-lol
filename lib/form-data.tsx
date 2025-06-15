/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-15 00:52:43
 * @ Modified time: 2025-06-15 17:50:19
 * @ Description:
 *
 * Form data utility so we don't pollute our components with too much logic.
 */

import { useState } from "react";

interface IFormData {
  [field: string]: any;
}

interface IFormDataStringified {
  [field: string]: string;
}

/**
 * The useFilter hook.
 * Check the returned interface for more info.
 *
 * @hook
 */
export const useFormData = <T extends IFormData>() => {
  const [form_data, set_form_data] = useState<T>({} as T);

  // Sets and individual filter
  const set_field = (field: keyof T, value: any) => {
    set_form_data({
      ...form_data,
      [field]: value,
    });
  };

  // Sets multiple fields at once
  const set_fields = (partial_data: Partial<T>) => {
    set_form_data({
      ...form_data,
      ...partial_data,
    });
  };

  // Creates a function that sets the filter
  const field_setter = (field: keyof T) => (value: string) => {
    set_form_data({ ...form_data, [field]: value });
  };

  return {
    form_data,
    set_field,
    set_fields,
    field_setter,
  };
};
