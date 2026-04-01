type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "date" | "number";
  full?: boolean;
  multiline?: boolean;
  rows?: number;
};

export function FormField({
  label,
  value,
  onChange,
  type = "text",
  full = false,
  multiline = false,
  rows = 5,
}: FormFieldProps) {
  return (
    <label className={full ? "md:col-span-2" : undefined}>
      <span className="text-sm font-medium text-[var(--text-black)]">
        {label}
      </span>

      {multiline ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={rows}
          className="mt-1 w-full rounded-lg border border-[var(--black-light)] px-3 py-2 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-[var(--black-light)] px-3 text-sm text-[var(--text-black)] outline-none transition-colors focus:border-[var(--orange-normal)]"
        />
      )}
    </label>
  );
}
