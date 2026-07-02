import { useCallback, useDeferredValue, useState } from "react";
import type { Platform } from "@/types";
import { Layout } from "@/components/layout/Layout";
import { ProfileList } from "@/components/profile/ProfileList";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { useFilteredProfiles } from "@/hooks/useFilteredProfiles";
import { getPlatformStyle } from "@/lib/platformStyles";

export function SearchPage() {
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [searchQuery, setSearchQuery] = useState("");
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const isFiltering = searchQuery !== deferredSearchQuery;
  const platformStyle = getPlatformStyle(platform);

  const { allProfiles, filteredProfiles } = useFilteredProfiles(
    platform,
    deferredSearchQuery
  );

  const handlePlatformChange = useCallback((nextPlatform: Platform) => {
    setPlatform(nextPlatform);
    setSearchQuery("");
  }, []);

  return (
    <Layout
      title="Find your next creator"
      description="Search top influencers across social platforms, explore detailed profiles, and build your shortlist."
    >
      <div className="space-y-6">
        <section className="surface-panel p-4 sm:p-6 animate-fade-in">
          <PlatformFilter
            selected={platform}
            onChange={handlePlatformChange}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </section>

        <section aria-labelledby="results-heading">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-left">
              <h2 id="results-heading" className="text-lg font-semibold">
                Results
              </h2>
              <p
                className={`text-sm text-[var(--color-ink-muted)] transition-opacity duration-200 ${
                  isFiltering ? "opacity-60" : "opacity-100"
                }`}
                aria-live="polite"
              >
                Showing {filteredProfiles.length} of {allProfiles.length} on{" "}
                <span className={`font-medium ${platformStyle.accent}`}>
                  {platformStyle.label}
                </span>
                {isFiltering ? " · filtering…" : ""}
              </p>
            </div>
          </div>

          <ProfileList profiles={filteredProfiles} platform={platform} />
        </section>
      </div>
    </Layout>
  );
}
