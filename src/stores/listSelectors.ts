import { useListStore } from "./listStore";

export { useListStore } from "./listStore";

export function useIsInList(userId: string): boolean {
  return useListStore((state) =>
    state.items.some((item) => item.user_id === userId)
  );
}

export function useListCount(): number {
  return useListStore((state) => state.items.length);
}

export function useListItems() {
  return useListStore((state) => state.items);
}

export function useHasHydrated(): boolean {
  return useListStore((state) => state.hasHydrated);
}

export function useAddProfile() {
  return useListStore((state) => state.addProfile);
}

export function useRemoveProfile() {
  return useListStore((state) => state.removeProfile);
}

export function useClearList() {
  return useListStore((state) => state.clearList);
}
