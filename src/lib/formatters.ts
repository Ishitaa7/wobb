import type { FullUserProfile } from "@/types";

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + "M";
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + "K";
  }
  return count.toLocaleString();
}

export function formatFollowersLabel(count: number): string {
  return `${formatFollowers(count)} followers`;
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export interface ProfileStat {
  label: string;
  value: string;
}

export function buildProfileStats(user: FullUserProfile): ProfileStat[] {
  const stats: ProfileStat[] = [
    { label: "Followers", value: formatFollowers(user.followers) },
    {
      label: "Engagement Rate",
      value: formatEngagementRate(user.engagement_rate),
    },
  ];

  if (user.posts_count !== undefined) {
    stats.push({
      label: "Posts",
      value: user.posts_count.toLocaleString(),
    });
  }

  if (user.avg_likes !== undefined) {
    stats.push({
      label: "Avg Likes",
      value: formatFollowers(user.avg_likes),
    });
  }

  if (user.avg_comments !== undefined) {
    stats.push({
      label: "Avg Comments",
      value: user.avg_comments.toLocaleString(),
    });
  }

  if (user.avg_views !== undefined && user.avg_views > 0) {
    stats.push({
      label: "Avg Views",
      value: formatFollowers(user.avg_views),
    });
  }

  if (user.engagements !== undefined) {
    stats.push({
      label: "Engagements",
      value: formatFollowers(user.engagements),
    });
  }

  return stats;
}
