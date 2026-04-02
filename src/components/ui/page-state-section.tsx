type PageStateSectionProps = {
  message: string;
  tone?: "muted" | "danger";
  actionLabel?: string;
  onAction?: () => void;
};

export function PageStateSection({
  message,
  tone = "muted",
  actionLabel,
  onAction,
}: PageStateSectionProps) {
  return (
    <section className="rounded-[1rem] border border-[var(--black-light)] bg-white p-6 text-center">
      <p
        className={
          tone === "danger"
            ? "text-[var(--red-normal)]"
            : "text-[var(--text-muted)]"
        }
      >
        {message}
      </p>

      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex h-[2.75rem] items-center justify-center rounded-[0.5rem] bg-[var(--orange-normal)] px-5 text-[0.938rem] font-semibold text-white transition-colors hover:bg-[var(--orange-dark)]"
        >
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
