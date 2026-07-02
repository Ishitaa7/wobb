import { memo, useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import type { Platform, UserProfileSummary } from "@/types";
import {
  useAddProfile,
  useIsInList,
  useRemoveProfile,
} from "@/stores/listSelectors";

interface AddToListButtonProps {
  profile: UserProfileSummary;
  platform: Platform;
  className?: string;
  fullWidth?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const AddToListButton = memo(function AddToListButton({
  profile,
  platform,
  className = "",
  fullWidth = false,
  onClick,
}: AddToListButtonProps) {
  const addProfile = useAddProfile();
  const removeProfile = useRemoveProfile();
  const isInList = useIsInList(profile.user_id);
  const [shouldPop, setShouldPop] = useState(false);
  const wasInList = useRef(isInList);

  useEffect(() => {
    if (isInList && !wasInList.current) {
      setShouldPop(true);
      const timer = window.setTimeout(() => setShouldPop(false), 350);
      wasInList.current = isInList;
      return () => window.clearTimeout(timer);
    }

    wasInList.current = isInList;
  }, [isInList]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);

      if (isInList) {
        removeProfile(profile.user_id);
        return;
      }

      addProfile(profile, platform);
    },
    [addProfile, removeProfile, isInList, onClick, platform, profile]
  );

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isInList}
      className={`interactive-button interactive-press inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
        fullWidth ? "w-full" : ""
      } ${shouldPop ? "animate-pop" : ""} ${
        isInList
          ? `border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 ${className}`
          : `bg-[var(--color-brand)] text-white shadow-sm hover:bg-[var(--color-brand-hover)] hover:shadow ${className}`
      }`}
    >
      {isInList ? (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          In List
        </>
      ) : (
        <>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          Add to List
        </>
      )}
    </button>
  );
});
