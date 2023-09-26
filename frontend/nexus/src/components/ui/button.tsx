import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-default-fg1 text-default-bg1 hover:bg-default-fg2",
        inverted: "border border-input bg-default-bg1 hover:bg-default-fg1 hover:text-default-bg1",
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        primaryInverted: "border border-primary bg-primary-inverted text-primary-foregroundInverted hover:bg-primary hover:text-primary-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
        destructiveInverted:
          "border border-destructive bg-destructive-inverted text-destructive-foregroundInverted hover:bg-destructive hover:text-destructive-foreground",
        outline:
          "border border-default-fg1 bg-default-bg1 text-default-fg1 hover:bg-default-fg1 hover:text-default-bg1",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        secondaryInverted:
          "border border-secondary bg-secondary-inverted text-secondary-foregroundInverted hover:bg-secondary hover:text-secondary-foreground",
        ghost: "hover:bg-default-fg1 hover:text-default-bg1",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
