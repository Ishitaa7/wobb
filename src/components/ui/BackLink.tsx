import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";

interface BackLinkProps {
  to?: string;
  label?: string;
}

export function BackLink({
  to = ROUTES.home,
  label = "Back to search",
}: BackLinkProps) {
  return (
    <Link
      to={to}
      className="interactive-link mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-brand)] hover:text-[var(--color-brand-hover)]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </Link>
  );
}
