import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-btn text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-[1px] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-white hover:bg-brand-600",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-[hsl(var(--border))] bg-surface hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))] text-foreground hover:bg-surface-alt",
        secondary:
          "bg-surface text-foreground border border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))] hover:bg-surface-alt",
        ghost: "text-foreground hover:bg-surface-alt",
        link: "text-brand-500 underline-offset-4 hover:underline",
        "brand-gradient-outline": "bg-surface text-brand-500 border-2 border-transparent bg-clip-padding relative before:absolute before:-inset-[2px] before:rounded-btn before:bg-brand-gradient before:-z-10 hover:before:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
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
