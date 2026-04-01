"use client";

import { cn } from "@/lib/utils";

type SegmentedTabOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedTabsProps<T extends string> = {
  value: T;
  options: SegmentedTabOption<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function SegmentedTabs<T extends string>({
  value,
  options,
  onChange,
  className,
}: SegmentedTabsProps<T>) {
  return (
    <div className={cn("flex items-center gap-[0.75rem]", className)}>
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "min-w-[5.75rem] rounded-[0.5rem] px-[0.875rem] py-[0.5rem] text-[1.125rem] font-semibold leading-[1.75rem] transition-colors",
              isActive
                ? "bg-[var(--orange-normal)] text-[var(--text-white)]"
                : "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)] hover:bg-[var(--black-light-hover)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
