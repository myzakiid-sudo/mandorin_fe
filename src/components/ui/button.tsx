import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[10px] rounded-[8px] cursor-pointer transition-colors duration-150 disabled:cursor-not-allowed select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--orange-normal)] text-[var(--text-white)] hover:bg-[var(--orange-normal-hover)] active:bg-[var(--orange-normal-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        secondary:
          "bg-[var(--blue-normal-active)] text-[var(--text-white)] hover:bg-[var(--blue-dark-hover)] active:bg-[var(--blue-dark-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        success:
          "bg-[var(--green-normal)] text-[var(--text-white)] hover:bg-[var(--green-dark)] active:bg-[var(--green-dark)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        danger:
          "bg-[var(--red-normal)] text-[var(--text-white)] hover:bg-[var(--red-dark)] active:bg-[var(--red-dark)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        warning:
          "bg-[var(--orange-dark)] text-[var(--text-white)] hover:bg-[var(--orange-dark-hover)] active:bg-[var(--orange-dark-active)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        outline:
          "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)] border border-[var(--btn-outline-border)] hover:bg-[var(--white-normal-hover)] active:bg-[var(--white-normal-active)] disabled:opacity-60",
      },
      size: {
        lg: "w-full h-[46px] px-[10px] text-[18px] leading-[24px] font-semibold",
        md: "w-full max-w-[391px] h-[44px] px-[10px] text-[16px] leading-[20px] font-semibold",
        sm: "w-[125px] h-[44px] px-[10px] text-[14px] leading-[16px] font-semibold",
      },
      fullWidth: {
        true: "!w-full !max-w-none",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, leftIcon, rightIcon, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    if (asChild) {
      // Jika komponen dipanggil sebagai child (misal <Button asChild><Link>...</Link></Button>),
      // kita serahkan sepenuhnya urusan rendering label & icons ke child element tersebut
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export default Button
