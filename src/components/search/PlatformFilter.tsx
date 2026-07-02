import { memo } from "react";
import type { Platform } from "@/types";
import { PLATFORMS } from "@/types";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { getPlatformStyle } from "@/lib/platformStyles";
import { SearchBar } from "./SearchBar";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PlatformFilter = memo(function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="space-y-4">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter by platform"
      >
        {PLATFORMS.map((platform) => {
          const isSelected = selected === platform;
          const style = getPlatformStyle(platform);

          return (
            <button
              key={platform}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onChange(platform)}
              className={`interactive-button interactive-press inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                isSelected
                  ? `${style.accentBg} ${style.accentBorder} ${style.accent} shadow-sm ring-2 ${style.ring}`
                  : "border-[var(--color-line)] bg-white text-[var(--color-ink-secondary)] hover:border-[var(--color-line-strong)] hover:bg-slate-50"
              }`}
            >
              <PlatformIcon platform={platform} />
              {style.label}
            </button>
          );
        })}
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />
    </div>
  );
});
