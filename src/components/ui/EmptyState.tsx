import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionTo?: string;
}

export function EmptyState({
  title,
  message,
  actionLabel = "Browse influencers",
  actionTo = ROUTES.home,
}: EmptyStateProps) {
  return (
    <div className="surface-card animate-fade-in-up mx-auto max-w-lg px-6 py-12 text-center">
      <div
        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-brand-muted)] text-[var(--color-brand)]"
        aria-hidden="true"
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">{message}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="interactive-button mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--color-brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-hover)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
