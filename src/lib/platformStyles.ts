import type { Platform } from "@/types";

export interface PlatformStyle {
  label: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  ring: string;
}

export const PLATFORM_STYLES: Record<Platform, PlatformStyle> = {
  instagram: {
    label: "Instagram",
    accent: "text-rose-600",
    accentBg: "bg-rose-50",
    accentBorder: "border-rose-200",
    ring: "ring-rose-500/30",
  },
  youtube: {
    label: "YouTube",
    accent: "text-red-600",
    accentBg: "bg-red-50",
    accentBorder: "border-red-200",
    ring: "ring-red-500/30",
  },
  tiktok: {
    label: "TikTok",
    accent: "text-cyan-700",
    accentBg: "bg-cyan-50",
    accentBorder: "border-cyan-200",
    ring: "ring-cyan-500/30",
  },
};

export function getPlatformStyle(platform: Platform): PlatformStyle {
  return PLATFORM_STYLES[platform];
}
