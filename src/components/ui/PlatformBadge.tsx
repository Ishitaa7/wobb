import { getPlatformStyle } from "@/lib/platformStyles";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import type { Platform } from "@/types";

interface PlatformBadgeProps {
  platform: Platform;
  size?: "sm" | "md";
}

export function PlatformBadge({ platform, size = "sm" }: PlatformBadgeProps) {
  const style = getPlatformStyle(platform);

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border ${style.accentBg} ${style.accentBorder} ${style.accent} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      }`}
    >
      <PlatformIcon platform={platform} className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      {style.label}
    </span>
  );
}
