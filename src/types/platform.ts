export type Platform = "instagram" | "youtube" | "tiktok";

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
};

export function isPlatform(value: string | null | undefined): value is Platform {
  return PLATFORMS.includes(value as Platform);
}

export function getPlatformLabel(platform: Platform): string {
  return PLATFORM_LABELS[platform];
}
