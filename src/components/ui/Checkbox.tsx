import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => (
    <input
      type="checkbox"
      ref={ref}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }