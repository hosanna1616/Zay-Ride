"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/use-auth-store";

/** Wait for zustand persist to rehydrate before trusting `isAuthenticated`. */
export function useAuthHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    /* Zustand persist rehydration from localStorage — intentional effect state. */
    /* eslint-disable react-hooks/set-state-in-effect -- persist hydration flag only */
    const api = useAuthStore.persist;
    if (!api) {
      setHydrated(true);
      return;
    }
    if (api.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = api.onFinishHydration(() => setHydrated(true));
    void api.rehydrate();
    /* eslint-enable react-hooks/set-state-in-effect */
    return unsub;
  }, []);

  return hydrated;
}
