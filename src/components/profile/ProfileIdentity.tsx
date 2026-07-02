import { memo } from "react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

interface ProfileIdentityProps {
  username: string;
  fullname: string;
  isVerified: boolean;
  subtitle?: string;
  headingLevel?: "h2" | "h3";
  compact?: boolean;
}

export const ProfileIdentity = memo(function ProfileIdentity({
  username,
  fullname,
  isVerified,
  subtitle,
  headingLevel: Heading = "h2",
  compact = false,
}: ProfileIdentityProps) {
  return (
    <div className="min-w-0">
      <Heading
        className={`flex items-center truncate font-semibold text-[var(--color-ink)] ${
          compact ? "text-sm" : "text-base"
        }`}
      >
        <span className="truncate">@{username}</span>
        <VerifiedBadge verified={isVerified} />
      </Heading>
      <p
        className={`truncate text-[var(--color-ink-secondary)] ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        {fullname}
      </p>
      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-[var(--color-ink-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  );
});
