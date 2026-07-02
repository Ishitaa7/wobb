import { Layout } from "@/components/layout/Layout";
import { SelectedListItem } from "@/components/profile/SelectedListItem";
import { BackLink } from "@/components/ui/BackLink";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useClearList,
  useListItems,
  useRemoveProfile,
} from "@/stores/listSelectors";

export function SelectedListPage() {
  const items = useListItems();
  const removeProfile = useRemoveProfile();
  const clearList = useClearList();

  return (
    <Layout
      title="My List"
      description="Your curated shortlist of influencers. Click a profile to view details or remove ones you no longer need."
    >
      <BackLink />

      {items.length === 0 ? (
        <EmptyState
          title="Your list is empty"
          message="Start exploring creators and add them to your list to build a shortlist for your next campaign."
        />
      ) : (
        <>
          <div className="animate-fade-in mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--color-ink-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">
                {items.length}
              </span>{" "}
              profile{items.length === 1 ? "" : "s"} saved
            </p>
            <button
              type="button"
              onClick={clearList}
              className="interactive-button self-start text-sm font-medium text-red-600 hover:text-red-700 sm:self-auto"
            >
              Clear all
            </button>
          </div>

          <ul className="space-y-4" role="list">
            {items.map((profile, index) => (
              <SelectedListItem
                key={profile.user_id}
                profile={profile}
                index={index}
                onRemove={removeProfile}
              />
            ))}
          </ul>
        </>
      )}
    </Layout>
  );
}
