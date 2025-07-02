/**
 * @ Author: BetterInternship
 * @ Create Time: 2025-06-15 00:52:43
 * @ Modified time: 2025-07-03 02:00:26
 * @ Description:
 *
 * Form data utility so we don't pollute our components with too much logic.
 */

import { useState } from "react";

export interface IFormData {
  [field: string]: any;
}

/**
 * The useFilter hook.
 * Check the returned interface for more info.
 *
 * @hook
 */
export const useFormData = <T extends IFormData>(initialValue?: Partial<T>) => {
  const [formData, setFormData] = useState<T>((initialValue as T) ?? ({} as T));

  // Sets and individual filter
  const setField = (field: keyof T, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Sets multiple fields at once
  const setFields = (partialValue: Partial<T>) => {
    setFormData({
      ...formData,
      ...partialValue,
    });
  };

  // Creates a function that sets the filter
  const fieldSetter = (field: keyof T) => (value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return {
    formData,
    setField,
    setFields,
    fieldSetter,
  };
};
