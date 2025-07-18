// Reusable status dropdown component - can be used anywhere
// Includes app statuses from useRefs hook, no need to pass options
import { GroupableRadioDropdown } from "@/components/ui/dropdown";
import { useDbRefs } from "@/lib/db/use-refs";

interface StatusDropdownProps {
  value: number;
  disabled?: boolean;
  onChange: (value: number) => void;
  className?: string;
}

export function StatusDropdown({
  value,
  disabled = false,
  onChange,
  className = "w-36", // Default width if not specified
}: StatusDropdownProps) {
  const { app_statuses } = useDbRefs();

  return (
    <GroupableRadioDropdown
      key={value} // Force re-render when value changes
      name="status"
      className={className}
      disabled={disabled}
      options={app_statuses}
      defaultValue={value}
      onChange={onChange}
    />
  );
}
