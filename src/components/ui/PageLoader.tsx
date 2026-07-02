export function PageLoader() {
  return (
    <div className="flex flex-col items-center gap-4 py-16 animate-fade-in" role="status" aria-live="polite">
      <div className="h-10 w-10 rounded-full border-2 border-[var(--color-line)] border-t-[var(--color-brand)] animate-spin" />
      <p className="text-sm text-[var(--color-ink-muted)] animate-pulse-soft">
        Loading page…
      </p>
    </div>
  );
}
