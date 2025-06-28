import { useState } from "react";
import { Input } from "./input";
import { useDetectClickOutside } from "react-detect-click-outside";

export const Autocomplete = ({
  options,
  setter,
  placeholder,
}: {
  options: string[];
  setter: (value: string) => void;
  placeholder?: string;
}) => {
  const [query, set_query] = useState("");
  const [is_open, set_is_open] = useState(false);
  const [selected, set_selected] = useState<string | null>(null);
  const ref = useDetectClickOutside({ onTriggered: () => set_is_open(false) });

  const filtered_options = query
    ? options.filter((option) =>
        option.toLowerCase().includes(query.toLowerCase())
      )
    : options;

  return (
    <div className="relative w-80" ref={ref}>
      <Input
        value={selected || query}
        className="border-gray-300"
        placeholder={placeholder}
        onChange={(e) => {
          setter(e.target.value);
          set_query(e.target.value);
          set_selected(null);
          set_is_open(true);
        }}
      />
      {is_open && !selected && query.length ? (
        <ul className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
          {filtered_options.length ? (
            filtered_options.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  set_selected(option);
                  setter(option);
                  set_query("");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                {option}
              </li>
            ))
          ) : (
            <li
              key="no-match"
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              No matching results.
            </li>
          )}
        </ul>
      ) : (
        <></>
      )}
    </div>
  );
};
