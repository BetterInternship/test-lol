"use client"

import * as React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>,
    VariantProps<typeof toggleVariants> {
  options?: string[]
  defaultValue?: string
  onValueChange?: (value: string) => void
}

const Toggle = React.forwardRef<React.ElementRef<typeof DropdownMenu.Trigger>, ToggleProps>(
  (
    {
      className,
      variant,
      size,
      children,
      options = ["Internships", "Full time", "Part time", "All types"],
      defaultValue = "Internships",
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState(defaultValue)

    const handleValueChange = (newValue: string) => {
      setValue(newValue)
      onValueChange?.(newValue)
    }

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger ref={ref} className={cn(toggleVariants({ variant, size, className }))}>
          <span>{value}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content className="min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            {options.map((option) => (
              <DropdownMenu.Item
                key={option}
                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                onClick={() => handleValueChange(option)}
              >
                {option}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    )
  },
)

Toggle.displayName = "Toggle"

export { Toggle, toggleVariants }
