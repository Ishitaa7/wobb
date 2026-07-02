interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;

  return (
    <span
      className="ml-1.5 inline-flex items-center rounded-full bg-sky-100 px-1.5 py-0.5 text-sky-700"
      aria-label="Verified account"
      title="Verified"
    >
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.55 16.45 5.1 12l1.41-1.41 3.04 3.04 8.45-8.45L19.4 6.6 9.55 16.45z" />
      </svg>
    </span>
  );
}
