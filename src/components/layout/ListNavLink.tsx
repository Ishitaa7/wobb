import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/lib/routes";
import { useHasHydrated, useListCount } from "@/stores/listSelectors";

export const ListNavLink = memo(function ListNavLink() {
  const listCount = useListCount();
  const hasHydrated = useHasHydrated();
  const [shouldPop, setShouldPop] = useState(false);
  const previousCount = useRef(listCount);

  useEffect(() => {
    if (!hasHydrated) {
      previousCount.current = listCount;
      return;
    }

    if (listCount > previousCount.current) {
      setShouldPop(true);
      const timer = window.setTimeout(() => setShouldPop(false), 350);
      previousCount.current = listCount;
      return () => window.clearTimeout(timer);
    }

    previousCount.current = listCount;
  }, [hasHydrated, listCount]);

  return (
    <Link
      to={ROUTES.list}
      className={`interactive-button inline-flex items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--color-ink)] shadow-sm hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-muted)] hover:text-[var(--color-brand)] ${
        shouldPop ? "animate-pop" : ""
      }`}
      aria-label={
        hasHydrated && listCount > 0
          ? `My List, ${listCount} profiles saved`
          : "My List"
      }
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
      </svg>
      <span>My List</span>
      {hasHydrated && listCount > 0 && (
        <span className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[var(--color-brand)] px-1.5 py-0.5 text-xs font-semibold text-white">
          {listCount}
        </span>
      )}
    </Link>
  );
});
