import { useEffect, useMemo, useState } from "react";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import {
  getCachedProfile,
  loadProfileByUsername,
} from "@/services/profileService";

interface ProfileRequestState {
  username: string;
  data: ProfileDetailResponse | null;
}

export interface UseProfileResult {
  user: FullUserProfile | null;
  isLoading: boolean;
  notFound: boolean;
}

export function useProfile(username: string | undefined): UseProfileResult {
  const [requestState, setRequestState] = useState<ProfileRequestState | null>(
    null
  );

  useEffect(() => {
    if (!username) return;

    let cancelled = false;

    loadProfileByUsername(username).then((data) => {
      if (!cancelled) {
        setRequestState({ username, data });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const cachedData =
    username === undefined ? undefined : getCachedProfile(username);

  const resolvedState = useMemo(() => {
    if (username !== undefined && cachedData !== undefined) {
      return { username, data: cachedData };
    }

    if (requestState?.username === username) {
      return requestState;
    }

    return null;
  }, [cachedData, requestState, username]);

  const isLoading = Boolean(username) && resolvedState === null;

  const user = resolvedState?.data?.data.user_profile ?? null;

  return {
    user,
    isLoading,
    notFound: Boolean(username) && !isLoading && resolvedState?.data === null,
  };
}
