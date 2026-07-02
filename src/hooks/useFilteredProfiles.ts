import { useMemo } from "react";
import type { Platform } from "@/types";
import { extractProfiles, filterProfiles } from "@/services/searchService";

export function useFilteredProfiles(platform: Platform, searchQuery: string) {
  const allProfiles = useMemo(() => extractProfiles(platform), [platform]);

  const filteredProfiles = useMemo(
    () => filterProfiles(allProfiles, searchQuery),
    [allProfiles, searchQuery]
  );

  return { allProfiles, filteredProfiles };
}
