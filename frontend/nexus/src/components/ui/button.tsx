import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
    {
        variants: {
            variant: {
                default: "bg-button-bg0 text-button-fg0 hover:bg-button-bg1",
                inverted: "border border- bg-default-bg1 hover:bg-button-bg0 hover:text-default-bg1",
                primary: "bg-primary-bg0 text-primary-fg0 hover:bg-primary-bg1",
                primaryInverted: "border border-primary text-primary-bg0 hover:bg-primary hover:text-primary-fg0",
                destructive: "bg-destructive-bg0 text-destructive-fg0 hover:bg-destructive-bg1",
                destructiveInverted: "border border-destructive bg-destructive-inverted text-destructive-bg0 hover:bg-destructive hover:text-destructive-fg0",
                outline: "border border-input bg-default-bg1 hover:bg-button-bg0 hover:text-default-bg1",
                secondary: "bg-secondary-bg0 text-secondary-fg0 hover:bg-secondary-bg1",
                secondaryInverted: "border border-secondary bg-secondary-inverted text-secondary-bg0 hover:bg-secondary hover:text-secondary-fg0",
                ghost: "hover:bg-button-bg0 hover:text-default-bg1",
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
    ({className, variant, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}
