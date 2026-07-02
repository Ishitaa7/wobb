import { useEffect } from "react";
import { useListStore } from "@/stores/listStore";

export function ListStoreHydrator() {
  useEffect(() => {
    const finishHydration = useListStore.persist.onFinishHydration(() => {
      useListStore.getState().setHasHydrated(true);
    });

    void useListStore.persist.rehydrate();

    return finishHydration;
  }, []);

  return null;
}
