import React from "react";

// ============================================================
// BUTTON COMPONENT — Mandorin Design System
// Berdasarkan Figma spec:
//   lg  → w-full / max-w-[528px], h-[46px], radius-8px
//   sm  → w-[125px], h-[44px], radius-8px
//   md  → w-[391px], h-[44px], radius-8px  (medium/default)
//
// Variants: primary | secondary | success | danger | warning | outline
// ============================================================

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "outline";

type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

// ─── Style Maps ──────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--orange-normal)] text-[var(--text-white)]",
    "hover:bg-[var(--orange-normal-hover)]",
    "active:bg-[var(--orange-normal-active)]",
    "disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
  ].join(" "),

  secondary: [
    "bg-[var(--blue-normal-active)] text-[var(--text-white)]",
    "hover:bg-[var(--blue-dark-hover)]",
    "active:bg-[var(--blue-dark-active)]",
    "disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
  ].join(" "),

  success: [
    "bg-[var(--green-normal)] text-[var(--text-white)]",
    "hover:bg-[var(--green-dark)]",
    "active:bg-[var(--green-dark)]",
    "disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
  ].join(" "),

  danger: [
    "bg-[var(--red-normal)] text-[var(--text-white)]",
    "hover:bg-[var(--red-dark)]",
    "active:bg-[var(--red-dark)]",
    "disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
  ].join(" "),

  warning: [
    "bg-[var(--orange-dark)] text-[var(--text-white)]",
    "hover:bg-[var(--orange-dark-hover)]",
    "active:bg-[var(--orange-dark-active)]",
    "disabled:bg-[var(--btn-disabled-bg)] disabled:text-[var(--btn-disabled-text)]",
  ].join(" "),

  outline: [
    "bg-[var(--btn-disabled-bg)] text-[var(--btn-disabled-text)]",
    "border border-[var(--btn-outline-border)]",
    "hover:bg-[var(--white-normal-hover)]",
    "active:bg-[var(--white-normal-active)]",
    "disabled:opacity-60",
  ].join(" "),
};

// Size maps — sesuai Figma
// lg: full width (atau max 528px), height 46px
// md: 391px fixed, height 44px
// sm: 125px fixed, height 44px
const sizeStyles: Record<ButtonSize, string> = {
  lg: "w-full h-[46px] px-[10px] text-[18px] leading-[24px] font-semibold",
  md: "w-full max-w-[391px] h-[44px] px-[10px] text-[16px] leading-[20px] font-semibold",
  sm: "w-[125px] h-[44px] px-[10px] text-[14px] leading-[16px] font-semibold",
};

// ─── Component ───────────────────────────────────────────────

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const base = [
    "inline-flex items-center justify-center gap-[10px]",
    "rounded-[8px]",
    "cursor-pointer",
    "transition-colors duration-150",
    "disabled:cursor-not-allowed",
    "select-none",
  ].join(" ");

  // fullWidth override — paksa w-full tanpa max-w
  const widthOverride = fullWidth ? "!w-full !max-w-none" : "";

  const classes = [
    base,
    variantStyles[variant],
    sizeStyles[size],
    widthOverride,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} disabled={disabled} {...props}>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;

// ============================================================
// CONTOH PENGGUNAAN:
//
// --- PRIMARY (tombol utama / CTA) ---
// <Button variant="primary" size="lg">Masuk sebagai pemilik proyek</Button>
// <Button variant="primary" size="md">Buat Janji Temu</Button>
// <Button variant="primary" size="sm">Berlangsung</Button>
//
// --- SECONDARY (tombol mandor) ---
// <Button variant="secondary" size="lg">Masuk sebagai mandor</Button>
//
// --- SUCCESS (selesai, setuju) ---
// <Button variant="success" size="sm">Selesai</Button>
// <Button variant="success" size="md">Setuju</Button>
//
// --- DANGER (hapus, tidak setuju) ---
// <Button variant="danger" size="sm">Hapus</Button>
// <Button variant="danger" size="sm">Tidak Setuju</Button>
//
// --- WARNING (kembali, hubungi) ---
// <Button variant="warning" size="sm">Kembali</Button>
// <Button variant="warning" size="sm">Hubungi</Button>
//
// --- OUTLINE (disabled style, lihat kontrak) ---
// <Button variant="outline" size="sm">Lihat Kontrak</Button>
//
// --- FULL WIDTH OVERRIDE ---
// <Button variant="primary" size="md" fullWidth>Kirim</Button>
//
// --- WITH ICON ---
// <Button variant="primary" size="md" leftIcon={<UploadIcon />}>
//   Pilih dari Komputer
// </Button>
//
// --- DISABLED ---
// <Button variant="primary" size="lg" disabled>Masuk</Button>
// ============================================================
