import { memo } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export const ProfileList = memo(function ProfileList({
  profiles,
  platform,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="surface-card animate-fade-in px-6 py-12 text-center">
        <p className="text-base font-medium text-[var(--color-ink)]">
          No profiles found
        </p>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Try a different search term or switch platforms.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2" role="list">
      {profiles.map((profile, index) => (
        <li key={profile.user_id} className="list-none">
          <ProfileCard
            profile={profile}
            platform={platform}
            index={index}
          />
        </li>
      ))}
    </ul>
  );
});
