import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

const profilesByPlatform = new Map<Platform, UserProfileSummary[]>();

function normalizeProfile(profile: UserProfileSummary): UserProfileSummary {
  return {
    ...profile,
    username: profile.username ?? profile.handle ?? profile.user_id,
  };
}

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const cached = profilesByPlatform.get(platform);
  if (cached) return cached;

  const profiles = getSearchData(platform).accounts.map((item) =>
    normalizeProfile(item.account.user_profile)
  );
  profilesByPlatform.set(platform, profiles);
  return profiles;
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return profiles;

  return profiles.filter((profile) => {
    const matchUsername = profile.username
      .toLowerCase()
      .includes(normalizedQuery);
    const matchFullname = profile.fullname
      .toLowerCase()
      .includes(normalizedQuery);
    return matchUsername || matchFullname;
  });
}
