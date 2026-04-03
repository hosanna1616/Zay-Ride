import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DEFAULT_SHOP } from "@/lib/seed-data";
import type { ShopProfile } from "@/types";

/**
 * Trader profile & demo flags.
 * BACKEND: `GET/PATCH /v1/me/shop` — replace local profile with authenticated shop.
 */
interface SettingsState {
  shop: ShopProfile;
  partnerView: boolean;
  hasSeenProTeaser: boolean;
  seedVersion: number;
  setShop: (p: Partial<ShopProfile>) => void;
  setPartnerView: (v: boolean) => void;
  markProTeaserSeen: () => void;
  bumpSeedVersion: (v: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      shop: { ...DEFAULT_SHOP },
      partnerView: false,
      hasSeenProTeaser: false,
      seedVersion: 0,
      setShop: (p) =>
        set((s) => ({ shop: { ...s.shop, ...p } })),
      setPartnerView: (partnerView) => set({ partnerView }),
      markProTeaserSeen: () => set({ hasSeenProTeaser: true }),
      bumpSeedVersion: (seedVersion) => set({ seedVersion }),
    }),
    {
      name: "zayride-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
