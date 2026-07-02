import { memo, useCallback, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AddToListButton } from "@/components/list/AddToListButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { staggerDelay } from "@/lib/animations";
import { formatFollowersLabel } from "@/lib/formatters";
import { ROUTES } from "@/lib/routes";
import type { Platform, UserProfileSummary } from "@/types";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  index?: number;
}

function stopCardButtonPropagation(event: MouseEvent<HTMLButtonElement>) {
  event.stopPropagation();
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  index = 0,
}: ProfileCardProps) {
  const navigate = useNavigate();

  const handleNavigate = useCallback(() => {
    navigate(ROUTES.profile(profile.username, platform));
  }, [navigate, platform, profile.username]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleNavigate();
      }
    },
    [handleNavigate]
  );

  return (
    <article
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View profile for ${profile.fullname}`}
      style={{ animationDelay: staggerDelay(index) }}
      className="animate-fade-in-up interactive-lift group surface-card flex cursor-pointer flex-col gap-4 p-4 text-left sm:flex-row sm:items-center sm:p-5"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <ProfileAvatar src={profile.picture} alt={profile.fullname} size="md" />
        <div className="min-w-0 flex-1">
          <div className="mb-2">
            <PlatformBadge platform={platform} />
          </div>
          <ProfileIdentity
            username={profile.username}
            fullname={profile.fullname}
            isVerified={profile.is_verified}
            headingLevel="h3"
          />
          <p className="mt-1 text-sm font-medium text-[var(--color-ink-secondary)]">
            {formatFollowersLabel(profile.followers)}
          </p>
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-stretch"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <AddToListButton
          profile={profile}
          platform={platform}
          onClick={stopCardButtonPropagation}
          fullWidth
        />
        <span className="hidden text-xs font-medium text-[var(--color-brand)] opacity-0 transition-opacity group-hover:opacity-100 sm:block sm:text-center">
          View profile →
        </span>
      </div>
    </article>
  );
});
