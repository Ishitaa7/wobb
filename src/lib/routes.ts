import type { Platform } from "@/types";

export const ROUTES = {
  home: "/",
  list: "/list",
  profile: (username: string, platform: Platform) =>
    `/profile/${encodeURIComponent(username)}?platform=${platform}`,
} as const;
