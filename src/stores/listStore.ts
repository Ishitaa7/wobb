import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, SelectedProfile, UserProfileSummary } from "@/types";

const STORAGE_KEY = "wobb-selected-profiles";

interface ListState {
  items: SelectedProfile[];
  hasHydrated: boolean;
  addProfile: (profile: UserProfileSummary, platform: Platform) => boolean;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isInList: (userId: string) => boolean;
  setHasHydrated: (value: boolean) => void;
}

function toSelectedProfile(
  profile: UserProfileSummary,
  platform: Platform
): SelectedProfile {
  return {
    user_id: profile.user_id,
    username: profile.username,
    fullname: profile.fullname,
    picture: profile.picture,
    platform,
    followers: profile.followers,
    is_verified: profile.is_verified,
  };
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      addProfile: (profile, platform) => {
        if (get().isInList(profile.user_id)) {
          return false;
        }

        set({
          items: [...get().items, toSelectedProfile(profile, platform)],
        });
        return true;
      },

      removeProfile: (userId) => {
        set({ items: get().items.filter((item) => item.user_id !== userId) });
      },

      clearList: () => {
        set({ items: [] });
      },

      isInList: (userId) => {
        return get().items.some((item) => item.user_id === userId);
      },

      setHasHydrated: (value) => {
        set({ hasHydrated: value });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
