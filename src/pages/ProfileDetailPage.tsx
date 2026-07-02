import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProfileDetailContent } from "@/components/profile/ProfileDetailContent";
import { BackLink } from "@/components/ui/BackLink";
import { ProfileDetailSkeleton } from "@/components/ui/ProfileDetailSkeleton";
import { usePlatformParam } from "@/hooks/usePlatformParam";
import { useProfile } from "@/hooks/useProfile";

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const { platform, platformLabel } = usePlatformParam();
  const { user, isLoading, notFound } = useProfile(username);

  if (!username) {
    return (
      <Layout title="Invalid profile">
        <p className="text-[var(--color-ink-secondary)]">This profile URL is invalid.</p>
        <Link
          to="/"
          className="mt-4 inline-flex text-sm font-medium text-[var(--color-brand)]"
        >
          Return to search
        </Link>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout title={`@${username}`} description="Loading profile details…">
        <ProfileDetailSkeleton />
      </Layout>
    );
  }

  if (notFound || !user) {
    return (
      <Layout title={`@${username}`}>
        <div className="surface-card max-w-lg p-6 text-left">
          <p className="font-medium text-red-600">
            Could not load profile details
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            We couldn&apos;t find a profile for <strong>@{username}</strong>.
            Try searching again from the home page.
          </p>
          <BackLink />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={user.fullname} description={`@${user.username} on ${platformLabel}`}>
      <BackLink />
      <ProfileDetailContent
        user={user}
        platform={platform}
        platformLabel={platformLabel}
      />
    </Layout>
  );
}
