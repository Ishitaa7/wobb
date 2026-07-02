import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileIdentity } from "@/components/profile/ProfileIdentity";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { staggerDelay } from "@/lib/animations";
import { formatFollowersLabel } from "@/lib/formatters";
import { ROUTES } from "@/lib/routes";
import type { SelectedProfile } from "@/types";

interface SelectedListItemProps {
  profile: SelectedProfile;
  index: number;
  onRemove: (userId: string) => void;
}

export const SelectedListItem = memo(function SelectedListItem({
  profile,
  index,
  onRemove,
}: SelectedListItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  const subtitle = useMemo(
    () => formatFollowersLabel(profile.followers),
    [profile.followers]
  );

  const profilePath = useMemo(
    () => ROUTES.profile(profile.username, profile.platform),
    [profile.platform, profile.username]
  );

  const handleRemove = useCallback(() => {
    setIsExiting(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (isExiting) {
      onRemove(profile.user_id);
    }
  }, [isExiting, onRemove, profile.user_id]);

  return (
    <li
      style={{ animationDelay: isExiting ? undefined : staggerDelay(index, 55) }}
      onAnimationEnd={handleAnimationEnd}
      className={
        isExiting
          ? "animate-slide-out list-none"
          : "animate-fade-in-up interactive-lift list-none"
      }
    >
      <div className="surface-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <Link
          to={profilePath}
          className="flex min-w-0 flex-1 items-center gap-4 rounded-lg focus-visible:outline-offset-4"
        >
          <ProfileAvatar src={profile.picture} alt={profile.fullname} size="md" />
          <div className="min-w-0 flex-1 text-left">
            <div className="mb-2">
              <PlatformBadge platform={profile.platform} />
            </div>
            <ProfileIdentity
              username={profile.username}
              fullname={profile.fullname}
              isVerified={profile.is_verified}
              subtitle={subtitle}
              headingLevel="h3"
            />
          </div>
        </Link>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isExiting}
          aria-label={`Remove ${profile.fullname} from list`}
          className="interactive-button interactive-press inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 sm:shrink-0"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
          Remove
        </button>
      </div>
    </li>
  );
});
