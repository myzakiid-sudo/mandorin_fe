import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateId(
  rawDate: string,
  variant: "short" | "long" = "short",
) {
  const parsed = new Date(rawDate);

  if (Number.isNaN(parsed.getTime())) {
    return rawDate;
  }

  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: variant === "long" ? "long" : "2-digit",
    year: variant === "long" ? "numeric" : "2-digit",
  });
}

export function formatCurrencyIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
