// Reusable status dropdown component - can be used anywhere
// Wraps the existing GroupableRadioDropdown with a cleaner interface
import { GroupableRadioDropdown } from "@/components/ui/dropdown";

interface StatusOption {
  id: number;
  name: string;
  value: number;
  label: string;
}

interface StatusDropdownProps {
  value: number;
  options: StatusOption[];
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function StatusDropdown({
  value,
  options,
  disabled = false,
  onChange,
}: StatusDropdownProps) {
  return (
    <GroupableRadioDropdown
      key={value} // Force re-render when value changes
      name="status"
      className="w-36"
      disabled={disabled}
      options={options}
      defaultValue={value}
      onChange={onChange}
    />
  );
}
