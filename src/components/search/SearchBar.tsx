import { memo } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = memo(function SearchBar({
  value,
  onChange,
}: SearchBarProps) {
  return (
    <div className="relative">
      <label htmlFor="influencer-search" className="sr-only">
        Search influencers by username or name
      </label>
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-ink-muted)]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
      </svg>
      <input
        id="influencer-search"
        type="search"
        className="w-full rounded-xl border border-[var(--color-line)] bg-slate-50/80 py-3 pl-11 pr-4 text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] transition-all focus:border-[var(--color-brand)] focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/15"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by username or full name…"
        autoComplete="off"
      />
    </div>
  );
});
