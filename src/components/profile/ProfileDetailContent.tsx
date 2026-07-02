import { memo, useMemo } from "react";
import { AddToListButton } from "@/components/list/AddToListButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileStatGrid } from "@/components/profile/ProfileStatGrid";
import { PlatformBadge } from "@/components/ui/PlatformBadge";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { buildProfileStats } from "@/lib/formatters";
import type { FullUserProfile, Platform } from "@/types";

interface ProfileDetailContentProps {
  user: FullUserProfile;
  platform: Platform;
  platformLabel: string;
}

export const ProfileDetailContent = memo(function ProfileDetailContent({
  user,
  platform,
  platformLabel,
}: ProfileDetailContentProps) {
  const stats = useMemo(() => buildProfileStats(user), [user]);

  return (
    <div className="space-y-6">
      <section className="surface-panel overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 sm:h-32" aria-hidden="true" />
        <div className="relative px-4 pb-6 sm:px-8 sm:pb-8">
          <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:gap-6">
            <div className="animate-scale-in shrink-0">
              <ProfileAvatar
                src={user.picture}
                alt={user.fullname}
                size="lg"
                priority
              />
            </div>
            <div className="min-w-0 flex-1 animate-fade-in-up pb-1 text-left">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <PlatformBadge platform={platform} size="md" />
                <span className="text-xs text-[var(--color-ink-muted)]">
                  {platformLabel}
                </span>
              </div>
              <h2 className="flex flex-wrap items-center gap-1 text-2xl font-bold sm:text-3xl">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </h2>
              <p className="mt-1 text-lg text-[var(--color-ink-secondary)]">
                {user.fullname}
              </p>
            </div>
          </div>

          {user.description && (
            <p className="mt-5 max-w-3xl text-left text-sm leading-relaxed text-[var(--color-ink-secondary)] sm:text-base">
              {user.description}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {user.url && (
              <a
                href={user.url}
                target="_blank"
                rel="noopener noreferrer"
                className="interactive-button inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
              >
                View on platform
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H9M17 7v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            )}
            <AddToListButton
              profile={user}
              platform={platform}
              className="sm:min-w-[10rem]"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="mb-4 text-left text-lg font-semibold">
          Profile stats
        </h2>
        <ProfileStatGrid stats={stats} />
      </section>
    </div>
  );
});
