import { cn } from "@/lib/utils";

type TableStateRowProps = {
  colSpan: number;
  message: string;
  tone?: "neutral" | "danger";
};

export function TableStateRow({
  colSpan,
  message,
  tone = "neutral",
}: TableStateRowProps) {
  return (
    <tr className="border-t border-[var(--black-light)]">
      <td
        colSpan={colSpan}
        className={cn(
          "px-[1rem] py-[1.25rem] text-center text-[0.938rem]",
          tone === "danger"
            ? "text-[var(--red-normal)]"
            : "text-[var(--text-secondary)]",
        )}
      >
        {message}
      </td>
    </tr>
  );
}
