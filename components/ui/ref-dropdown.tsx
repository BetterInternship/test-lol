import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./button";

export function RefDropdown({ name, options, defaultValue, value, onChange, activeDropdown, onClick, validFieldClassName }: { name: string; options: string[]; value: string; defaultValue: string; onChange: (value: string) => void, activeDropdown: string, onClick: () => void, validFieldClassName: string }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (name != activeDropdown)
      setIsOpen(false);
  }, [name, activeDropdown])
  
  return (
    <div className="relative w-full z-[80]">
      <Button
        type="button"
        variant="outline" 
        onClick={() => (setIsOpen(!isOpen), onClick())}
        className={
          (value === defaultValue ? "border-gray-300" : validFieldClassName) +
          " h-12 px-4 flex items-center gap-2 w-full text-ellipsis border-2 z-[80]"
        }
      >
        <p className={ (value === defaultValue ? "text-opacity-50 text-gray-800" : "") + " line-clamp-1 z-50"}>
          {value}
        </p>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full mt-1 bg-white border rounded-lg shadow-lg z-[100] min-w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option)
                setIsOpen(false)
              }}
              className={
                (option === value ? "bg-gray-200" :
                "") + " w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}