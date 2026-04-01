import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function AppButton({
  children,
  loading = false,
  loadingText = "Memproses...",
  variant = "primary",
  className,
  disabled,
  ...props
}: AppButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center rounded-[0.5rem] px-[1rem] py-[0.375rem] text-[1rem] font-semibold leading-[1.5rem] transition-colors disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-[var(--orange-normal)] text-[var(--text-white)] hover:bg-[var(--orange-normal-hover)] disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
        variant === "secondary" &&
          "border border-[var(--orange-normal)] bg-white text-[var(--orange-normal)] hover:bg-[var(--orange-light)] disabled:border-[var(--btn-outline-border)] disabled:text-[var(--btn-disabled-text)]",
        variant === "ghost" &&
          "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]",
        className,
      )}
    >
      {loading ? loadingText : children}
    </button>
  );
}
