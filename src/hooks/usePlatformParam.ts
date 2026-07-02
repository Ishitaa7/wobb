import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { getPlatformLabel, isPlatform } from "@/types";

const DEFAULT_PLATFORM: Platform = "instagram";

export function usePlatformParam() {
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform");
  const platform: Platform = isPlatform(platformParam)
    ? platformParam
    : DEFAULT_PLATFORM;

  return {
    platform,
    platformLabel: isPlatform(platformParam)
      ? getPlatformLabel(platform)
      : "unknown",
  };
}
